const router = require('express').Router()
const { Op } = require('sequelize');
const { Blog, User } = require('../models');
const sessionChecker = require('./utils/sessionChecker');
const tokenExtractor = require ('./utils/tokenExtractor')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    order: [['likes', 'DESC']],
    where
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, sessionChecker, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({...req.body, userId: user.id})
  return res.json(blog)
})

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
})

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.delete('/:id', tokenExtractor, sessionChecker, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.findByPk(req.params.id, {
    include: {
      model: User,
    }
  })
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }
  if (user.id === blog.userId) {
    await blog.destroy()
    return res.status(204).end()
  } else {
    return res.status(401).json({ error: 'incorrect user' })
  }
})

module.exports = router
const router = require('express').Router()
const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ['title']
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.get('/:id', async (req, res) => {
  const where = {};

  if (req.query.read) {
    where.read = req.query.read === 'true'
  }

  const user = await User.findByPk(req.params.id, {
    include: [
      { 
        model: Blog,
        as: 'readings',
        attributes: ['id', 'author', 'title', 'likes', 'year'],
        through: {
          attributes: ['id', 'read'],
          where
        },
      }
    ]
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findByPk(req.body.id)
  if (user) {
    console.log('user:', user)
    user.username = req.params.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})


module.exports = router
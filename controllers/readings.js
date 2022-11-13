const router = require('express').Router()
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken')
const { Blog, User, Reading } = require('../models')
const { SECRET } = require('../util/config')
const tokenExtractor = require ('./utils/tokenExtractor');
const sessionChecker = require('./utils/sessionChecker');


router.post('/', async (req, res) => {
  const user = await User.findByPk(req.body.user_id)
  const blog = await Blog.findByPk(req.body.blog_id)
  const reading = await Reading.create({userId: user.id, blogId: blog.id})
  return res.json(reading)
})

router.put('/:id', tokenExtractor, sessionChecker, async (req, res) => {
  const reading = await Reading.findByPk(req.params.id)
  const user = await User.findByPk(req.decodedToken.id)

  if (reading.userId === user.id) {
    reading.read = req.body.read
    await reading.save();
    return res.json(reading)
  } else {
    return res.status(404).json({ error: 'not logged in as correct user' })
  }
})


module.exports = router
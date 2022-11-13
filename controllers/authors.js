const router = require('express').Router()
const { fn, col } = require('sequelize');

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await Blog.findAll({
    attributes: [
      'author',
      [fn('COUNT', col('author')), 'blogs'],
      [fn('SUM', col('likes')), 'likes']
    ],
    group: 'author'
  })
  res.json(users)
})

module.exports = router
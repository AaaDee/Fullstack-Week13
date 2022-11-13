const jwt = require('jsonwebtoken')
const router = require('express').Router()
const tokenExtractor = require ('./utils/tokenExtractor')


const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  await Session.destroy({
    where: {
      userId: user.id
    }
  })

  res
    .status(200)
    .end()
})

module.exports = router
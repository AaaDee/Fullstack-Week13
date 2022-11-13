const { Session, User } = require("../../models");

const sessionChecker = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  const session = await Session.findOne({
    where: {
      userId: user.id
    }
  })

  if (!session) {
    return res.status(404).json({ error: 'account disabled' })
  }

  next()
}

module.exports = sessionChecker;
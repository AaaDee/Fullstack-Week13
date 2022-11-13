const errorHandler = (error, request, response, next) => {
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: error.message})
  }

  console.error(error.message)

  next(error)
}

module.exports = errorHandler
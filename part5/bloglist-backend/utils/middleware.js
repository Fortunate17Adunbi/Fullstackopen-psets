const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger =  (request, response, next) => {
  logger.info('Method: ', request.method)
  logger.info('Path: ', request.path)
  logger.info('body: ', request.body)
  logger.info('---')
  next()
}

const unKnownEndpoint = (request, response) => {
  return response.status(404).json({ error: 'unKnown Endpoint' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer')) {
    request.token = authorization.replace('Bearer ', '')
    console.log('token extractor ', request.token)
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  // console.log('user extractor ', request.token)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // console.log('verify success')
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(401).json({ error: 'userId invalid' })
  }

  request.user = user
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error('Errorhandler: ', error.message)
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'MongoServerError' && error.message.includes ('E11000 duplicate key error')) {
    return response.status(400).send({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Invalid token or missing' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'Token expired' })
  }
  next(error)
}

module.exports = {
  requestLogger, unKnownEndpoint, errorHandler, tokenExtractor, userExtractor
}
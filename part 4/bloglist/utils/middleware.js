
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    logger.info(`${req.method} ${req.path}`)
    if (req.body && Object.keys(req.body).length) logger.info('Body:', req.body)
  }
  next()
}

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7)
  } else {
    req.token = null
  }
  next()
}

// Use on routes that need an authenticated user
const userExtractor = async (req, res, next) => {
  try {
    const token = req.token
    if (!token) return res.status(401).json({ error: 'token missing' })
    const decoded = jwt.verify(token, process.env.SECRET)
    if (!decoded.id) return res.status(401).json({ error: 'token invalid' })

    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ error: 'user not found' })

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'token invalid' })
  }
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  logger.error(err.name, err.message)
  if (err.name === 'CastError') return res.status(400).send({ error: 'malformatted id' })
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message })
  next(err)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
}
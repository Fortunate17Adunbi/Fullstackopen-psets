const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const app = express()

logger.info('connecting to db')
mongoose.set('strictQuery',false)
mongoose.connect(config.MONGODB_URI, { bufferTimeoutMS: 90000 })
  .then(() => {
    logger.info('Connected to mongoDb')
  }).catch(error => {
    logger.error('Error connecting to DB: ', error.message)
  })

app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/blogs',blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.errorHandler)

module.exports = app
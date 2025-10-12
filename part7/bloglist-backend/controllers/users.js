const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  console.log('users ', users)
  response.status(200).json(users)
})
usersRouter.post('/', async (request, response) => {
  console.log('requst body', request.body)
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'Password is required and must be at least 3 characters' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await newUser.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter
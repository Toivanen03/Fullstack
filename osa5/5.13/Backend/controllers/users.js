const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
  .find({})
  .populate('blogs', { title: 1, author: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (username === undefined || username.length < 3) {
    return response.status(400).json({ error: 'Username must be at least 3 characters' })
  }
  if (password === undefined || password.length < 3) {
    return response.status(400).json({ error: 'Password must be at least 3 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcryptjs.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
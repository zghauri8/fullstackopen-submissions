const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    title: 1, author: 1, url: 1, likes: 1
  })
  res.json(users)
})

usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body
    if (!password || password.length < 3) {
      return res.status(400).json({ error: 'password must be at least 3 characters' })
    }
    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'username must be at least 3 characters' })
    }
    const existing = await User.findOne({ username })
    if (existing) {
      return res.status(400).json({ error: 'username must be unique' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({ username, name, passwordHash })
    const saved = await user.save()
    res.status(201).json(saved)
  } catch (err) {
    next(err)
  }
})

module.exports = usersRouter
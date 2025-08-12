
const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Root', passwordHash })
  await user.save()
})

describe('user creation', () => {
  test('succeeds with a fresh username (4.15)', async () => {
    const usersAtStart = await User.find({})

    const newUser = { username: 'mluukkai', name: 'Matti', password: 'salainen' }
    await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    assert.ok(usernames.includes('mluukkai'))
  })

  test('fails with 400 if username already taken (4.16)', async () => {
    const newUser = { username: 'root', name: 'Another', password: 'pass123' }
    const res = await api.post('/api/users').send(newUser).expect(400)
    assert.match(res.body.error, /unique|already/i)
  })

  test('fails with 400 if username or password too short (4.16)', async () => {
    const noUsername = { name: 'NoU', password: 'abc' }
    const shortUsername = { username: 'ab', name: 'Short', password: 'abc' }
    const shortPassword = { username: 'valid', name: 'ShortP', password: 'ab' }

    await api.post('/api/users').send(noUsername).expect(400)
    await api.post('/api/users').send(shortUsername).expect(400)
    await api.post('/api/users').send(shortPassword).expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
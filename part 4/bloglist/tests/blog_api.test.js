// tests/blog_api.test.js
const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let auth = { token: null, userId: null }

const loginAndGetToken = async (username, password) => {
  const res = await api.post('/api/login').send({ username, password }).expect(200)
  return res.body.token
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // create user and token
  const passwordHash = await bcrypt.hash('pass123', 10)
  const user = await new User({ username: 'tester', name: 'Test User', passwordHash }).save()
  auth.userId = user.id
  auth.token = await loginAndGetToken('tester', 'pass123')

  // seed initial blogs owned by this user
  const ownedBlogs = helper.initialBlogs.map(b => ({ ...b, user: user._id }))
  await Blog.insertMany(ownedBlogs)
})

describe('GET /api/blogs', () => {
  test('returns json and correct count (4.8)', async () => {
    const res = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    assert.strictEqual(res.body.length, helper.initialBlogs.length)
  })

  test('unique id field is named id (4.9)', async () => {
    const res = await api.get('/api/blogs')
    const blog = res.body[0]
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

describe('POST /api/blogs', () => {
  test('succeeds with valid data and token (4.10 + 4.19)', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${auth.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('First class tests'))
  })

  test('defaults likes to 0 if missing (4.11)', async () => {
    const newBlog = { title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog...' }
    const res = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${auth.token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(res.body.likes, 0)
  })

  test('fails with 400 if title or url missing (4.12)', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${auth.token}`)
      .send({ author: 'A', url: 'http://x.y' })
      .expect(400)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${auth.token}`)
      .send({ title: 'T', author: 'A' })
      .expect(400)
  })

  test('fails with 401 if token missing (4.23)', async () => {
    await api.post('/api/blogs').send({ title: 'No token', url: 'http://x', likes: 1 }).expect(401)
  })
})

describe('DELETE /api/blogs', () => {
  test('succeeds with 204 when owner deletes (4.21)', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${auth.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  test('fails with 401 when no token (4.21)', async () => {
    const [blogToDelete] = await helper.blogsInDb()
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)
  })

  test('fails with 403 when wrong user tries to delete (4.21)', async () => {
    // create another user and a blog owned by them
    const passwordHash = await bcrypt.hash('otherpass', 10)
    const otherUser = await new User({ username: 'other', name: 'Other', passwordHash }).save()
    const otherToken = await loginAndGetToken('other', 'otherpass')

    const blog = await new Blog({
      title: 'Owned by other',
      author: 'X',
      url: 'http://x',
      likes: 0,
      user: otherUser._id,
    }).save()

    // tester tries to delete other user's blog
    await api
      .delete(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${auth.token}`)
      .expect(403)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('updates likes (4.14)', async () => {
    const [blog] = await helper.blogsInDb()
    const res = await api.put(`/api/blogs/${blog.id}`).send({ likes: blog.likes + 1 }).expect(200)
    assert.strictEqual(res.body.likes, blog.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
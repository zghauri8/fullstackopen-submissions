// controllers/blogs.js
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

// list with creator details
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

// create requires token; creator = token user
blogsRouter.post('/', userExtractor, async (req, res, next) => {
  try {
    const user = req.user // set by middleware
    const blog = new Blog({ ...req.body, user: user._id })
    const saved = await blog.save()
    user.blogs = user.blogs.concat(saved._id)
    await user.save()
    res.status(201).json(saved)
  } catch (err) {
    next(err)
  }
})

// delete requires token and ownership
blogsRouter.delete('/:id', userExtractor, async (req, res, next) => {
  try {
    const user = req.user
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).end()

    if (blog.user && blog.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'only creator can delete the blog' })
    }

    await Blog.findByIdAndDelete(req.params.id)
    user.blogs = user.blogs.filter(b => b.toString() !== req.params.id)
    await user.save()
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

// likes update stays open (no auth needed for 4.14)
blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const { likes } = req.body
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
    )
    if (!updated) return res.status(404).end()
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

module.exports = blogsRouter
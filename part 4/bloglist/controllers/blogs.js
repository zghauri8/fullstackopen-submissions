
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')


blogsRouter.post('/:id/comments', async (req, res, next) => {
  try {
    const { id } = req.params
    const { comment } = req.body
    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'comment is required' })
    }
    const blog = await Blog.findById(id)
    if (!blog) return res.status(404).end()
    blog.comments = blog.comments.concat(comment.trim())
    const saved = await blog.save()
    res.status(201).json(saved)
  } catch (err) {
    next(err)
  }
})

module.exports = blogsRouter
const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  .find({})
  .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(request.params.id)
    if (blog) {
      response.status(204).end()
    } else {
      response.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    response.status(400).json({ error: 'invalid id'})
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).send({ error: 'Blog not found' })
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const { title, author, url, likes } = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})


blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body
  if (!title || !url || !author || !likes) {
    return response.status(400).json({ error: 'All fields required' })
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
      { new: true, runValidators: true, context: 'query' }
    )

    if (updatedBlog) {
      response.status(200).json(updatedBlog)
    } else {
      response.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
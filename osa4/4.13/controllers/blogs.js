const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')

blogsRouter.get('/', async (request, response) => {
    Blog.find({}).then(blogs => {
    response.json(blogs)
    })
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

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0
  })
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})


blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body
  Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter
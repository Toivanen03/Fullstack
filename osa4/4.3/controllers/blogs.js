const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')

blogsRouter.get('/', (request, response) => {
    Blog.find({}).then(blogs => {
    response.json(blogs)
    })
})

blogsRouter.delete('/:id', (request, response, next) => {
    const id = request.params.id
    Blog.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        response.status(204).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).send({ error: 'Blog not found' })
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog.save()
    .then(savedBlog => {
      response.json(savedBlog)
    })
    .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
  const { title, author, url, likes } = request.body
  Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter
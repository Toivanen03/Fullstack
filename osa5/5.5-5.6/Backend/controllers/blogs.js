const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/middleware.js').userExtractor

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  .find({})
  .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    const blogWriter = blog.user.toString()
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = request.user.id

    if (blogWriter === user) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).json()
    } else {
      return response.status(401).json({ error: 'Only blog creator is allowed to delete a blog'})
    }

  } catch (error) {
    return response.status(400).json({ error: 'invalid id'})
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

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const { title, author, url, likes } = request.body
  let decodedToken;
  if (request.token) {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } else {
    return response.status(401).json({ error: 'missing token' })
  }
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  
  const user = request.user

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


blogsRouter.put('/:id', userExtractor, async (request, response, next) => {
  const { title, author, url, likes } = request.body
  if (!title || !url || !author || !likes) {
    return response.status(400).json({ error: 'All fields required' })
  }

  try {
    const originalBlog = await Blog.findById(request.params.id)
    if (!originalBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    const originalBlogWriter = originalBlog.user.toString()
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = request.user.id

    if (originalBlogWriter === user) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { title, author, url, likes },
        { new: true, runValidators: true, context: 'query' }
      )

      if (updatedBlog) {
        return response.status(200).json(updatedBlog)
      } else {
        return response.status(404).json({ error: 'Blog not found' })
      }
    } else {
      return response.status(401).json({ error: 'Only blog creator is allowed to modify this blog'})
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
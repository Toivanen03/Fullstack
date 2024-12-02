const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcryptjs = require('bcryptjs')
const User = require('../models/user')
const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

describe('Confirm the format of a blog:', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('id-field is not allowed to appear as "_id"', async () => {
    const userAtStart = await User.findOne({ username: 'MarkZ' })
    const token = jwt.sign({ id: userAtStart._id, username: userAtStart.username }, process.env.SECRET)
    const newBlog = {
      title: "Kuinka ymmärtää naisia?",
      author: "Nimetön oman turvallisuuden takia",
      url: "http://www.autotalli.com",
      likes: 5
    }

    const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

    assert.ok(response.body.id)
    assert.strictEqual(response.body._id, undefined)
  })

  test('ensure likes-field exists and is set to 0 if missing', async () => {
    const allBlogs = (await api.get('/api/blogs').expect(200)).body

    await helper.fixMissingLikes(allBlogs, api)

    const updatedBlogs = (await api.get('/api/blogs').expect(200)).body
    updatedBlogs.forEach(blog => {
      assert.strictEqual(blog.likes >= 0, true, `Blog ${blog.id} is missing likes or has invalid value`)
    })
  })
}) 

describe('Confirm requests:', () => {
  describe('POST:', () => {
    test('new POST-entry and increment of database with valid token', async () => {
      const userAtStart = await User.findOne({ username: 'MarkZ' })
      const token = jwt.sign({ id: userAtStart._id, username: userAtStart.username }, process.env.SECRET)
    
      const newBlog = {
        title: "Epäsosiaalinen sosiaalinen media",
        author: "Mark Zuckerberg",
        url: "http://www.facebook.com",
        likes: 5,
      }
    
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(n => n.title)
      assert(titles.includes('Epäsosiaalinen sosiaalinen media'))
    })

    test('check for title and url at POST', async () => {
      const newBlogWithoutTitle = {
        author: "Simo Toivanen",
        url: "http://www.simotoivanen.fi",
        likes: 10
      }

      const newBlogWithoutUrl = {
        title: "Internetin synty ja tuho",
        author: "Simo Toivanen",
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlogWithoutTitle)
        .expect(400)

      await api
        .post('/api/blogs')
        .send(newBlogWithoutUrl)
        .expect(400)
    })
  })

  describe('DELETE:', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(helper.initialBlogs)
    })
    test('delete a single blog', async () => {
      const usersAtStart = await User.find({})
      const user = usersAtStart[0]

      const newBlog = {
        title: 'Cuckoo clock',
        author: 'It is I, Leclerc',
        url: 'https://www.imdb.com/title/tt0086659/',
        likes: 10,
        user: user._id
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${jwt.sign({ id: user._id, username: user.username }, process.env.SECRET)}`)
        .send(newBlog)
        .expect(201)

      const blogsAtStart = await api.get('/api/blogs').expect(200)
      const blogToDelete = blogsAtStart.body.find(blog => blog.title === newBlog.title)
      assert(blogToDelete)
  
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET)
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await api.get('/api/blogs').expect(200)
      const titles = blogsAtEnd.body.map(blog => blog.title)
      assert(!titles.includes(blogToDelete.title))
    })
    
    test('returns 404 if not exist', async () => {
      const fakeId = await helper.nonExistingId()
      await api
      .delete(`/api/blogs/${fakeId}`)
      .expect(404)
    })
  
    test('returns 400 if invalid ID', async () => {
      const usersAtStart = await User.find({})
      const user = usersAtStart[0]
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET)
      const fakeId = '123'
      await api
      .delete(`/api/blogs/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
    })
  })

  describe('PUT:', () => {
    test('modify blog likes', async () => {
      const newUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'testpassword'
      }
    
      const userResponse = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const user = userResponse.body
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET)

      const newBlog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 5,
        user: user.id
      }
    
      const blogResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const createdBlog = blogResponse.body

      const modifiedBlogEntry = {
        title: createdBlog.title,
        author: createdBlog.author,
        url: createdBlog.url,
        likes: 999
      }

      const putResponse = await api
        .put(`/api/blogs/${createdBlog.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(modifiedBlogEntry)
        .expect(200)

      assert.strictEqual(putResponse.body.likes, modifiedBlogEntry.likes)

      const blogsAtEnd = await api.get('/api/blogs').expect(200)
      const updatedBlog = blogsAtEnd.body.find(blog => blog.id === createdBlog.id)
      assert.strictEqual(updatedBlog.likes, modifiedBlogEntry.likes)
    })
    
    test('fails with 400 if title is missing', async () => {
      const blogs = await api.get('/api/blogs').expect(200)
      const blogToModify = blogs.body[0]
    
      const invalidBlog = {
        author: blogToModify.author,
        url: blogToModify.url,
        likes: blogToModify.likes
      }
    
      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(invalidBlog)
        .expect(400)
    })
    
    test('fails with 404 if blog id does not exist', async () => {
      const nonExistingId = await helper.nonExistingId()
    
      const updatedBlog = {
        title: 'Saatanalliset säkeet',
        author: 'Salman Rushdie',
        url: 'https://fi.wikipedia.org/wiki/Saatanalliset_s%C3%A4keet',
        likes: 42
      }
    
      await api
        .put(`/api/blogs/${nonExistingId}`)
        .send(updatedBlog)
        .expect(404)
    })    
  })
})

describe('Password and user tests:', () => {
  describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcryptjs.hash('SecretPassw0rd', 10)
      const user = new User({ username: 'MarkZ', passwordHash })
      user.blogs = [
        "5a422a851b54a676234d17f7",
        "5a422aa71b54a676234d17f8",
        "5a422b3a1b54a676234d17f9",
        "5a422b891b54a676234d17fa",
        "5a422ba71b54a676234d17fb",
        "5a422bc61b54a676234d17fc"
      ]

      await user.save()
    })

    test('user creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'Zimppa',
        name: 'Simo Toivanen',
        password: 'idooknenialas',
      }
      
      await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('user creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'MarkZ',
        name: 'John Travolta',
        password: 'SecretPassw0rd',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation fails with username less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const invalidUser = {
        username: 'ST',
        name: 'Simo Toivanen',
        password: 'SecretPassw0rd',
      }
  
      const result = await api
        .post('/api/users')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('Username must be at least 3 characters'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation fails with password less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const invalidPasswordUser = {
        username: 'SHT',
        name: 'Simo Toivanen',
        password: 'ts',
      }
  
      const result = await api
        .post('/api/users')
        .send(invalidPasswordUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('Password must be at least 3 characters'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
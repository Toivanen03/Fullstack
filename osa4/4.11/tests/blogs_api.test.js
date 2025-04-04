const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

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
    const newBlog = {
      title: "Kuinka ymmärtää naisia?",
      author: "Nimetön oman turvallisuuden takia",
      url: "http://www.autotalli.com",
      likes: 5
    }

    const response = await api.post('/api/blogs').send(newBlog).expect(201)
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
  test('test POST request and confirm response', async () => {
    const newBlog = {
      title: "Epäsosiaalinen sosiaalinen media",
      author: "Mark Zuckerberg",
      url: "http://www.facebook.com",
      likes: 5,
    }
    let blogCountQuery = await api.get('/api/blogs').expect(200)
    const blogCountBeforePOST = blogCountQuery.body.length

    const postResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    blogCountQuery = await api.get('/api/blogs').expect(200)
    const blogCountAfterPOST = blogCountQuery.body.length

    assert.strictEqual(blogCountAfterPOST, blogCountBeforePOST + 1)
  })
})  

after(async () => {
  await mongoose.connection.close()
})
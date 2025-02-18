const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper.js')
const helper = require('./test_helper.js')
const _ = require('lodash')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const emptyList = []

  const blogs = helper.initialBlogs
    
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })
  test ('of a bigger list is calculated right', () => {
    const likes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, likes)
  })
})

describe('max numbers with', () => {
  const blogs = helper.initialBlogs
  
  test('most likes', () => {
    const mostLikes = blogs.reduce((max, blog) => Math.max(max, blog.likes), 0)
    const result = listHelper.favoriteBlogs(blogs)
    assert.strictEqual(result, mostLikes)
    const mostLikedBlog = blogs.find(blog => blog.likes === mostLikes)
    delete mostLikedBlog._id
    delete mostLikedBlog.__v
    delete mostLikedBlog.url
    console.log("Most liked blog:", mostLikedBlog)
  })

  test('most blogs written by', () => {
    const blogCounts = _.countBy(blogs, 'author')
    const mostBlogsAuthor = _.maxBy(Object.entries(blogCounts), ([, count]) => count)

    const mostWrittenAuthor = JSON.stringify({
        author: mostBlogsAuthor[0],
        blogs: mostBlogsAuthor[1]
    })

    const result = listHelper.mostBlogs(blogs)
    assert.strictEqual(result, mostWrittenAuthor)
    console.log('Most written blogs:', JSON.parse(mostWrittenAuthor))
  })

  test('most total likes', () => {
    const authorLikes = blogs.reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + blog.likes
      return acc
    }, {})
    const mostLikedAuthor = _.maxBy(Object.keys(authorLikes), author => authorLikes[author])
    const result = JSON.stringify({
      author: mostLikedAuthor,
      likes: authorLikes[mostLikedAuthor]
    })

    const expectedResult = JSON.stringify(listHelper.mostLikes(blogs))
    assert.strictEqual(result, expectedResult)
    console.log('Most total likes:', JSON.parse(expectedResult))
  })
})

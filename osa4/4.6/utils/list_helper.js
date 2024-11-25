const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}
  
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlogs = (blogs) => {
    return blogs.reduce((max, blog) => Math.max(max, blog.likes), 0)
}

const mostBlogs = (blogs) => {
    const blogCounts = _.countBy(blogs, 'author')
    const [author, blogsWritten] = _.maxBy(Object.entries(blogCounts), ([, count]) => count)
    return JSON.stringify({ author, blogs: blogsWritten })
}

module.exports = {
    dummy, totalLikes, favoriteBlogs, mostBlogs
}
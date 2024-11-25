const dummy = (blogs) => {
    return 1
}
  
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlogs = (blogs) => {
    return blogs.reduce((max, blog) => Math.max(max, blog.likes), 0)
}

module.exports = {
    dummy, totalLikes, favoriteBlogs
}
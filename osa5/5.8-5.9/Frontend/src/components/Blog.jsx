import { useState } from 'react'

const Blog = ({ blog, onLike }) => {
  const [visible, setVisible] = useState(false)

  const toggleView = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user
    }
    onLike(blog.id, updatedBlog)
  }

  return (
    <div className="blogStyle">
      <br />
      {blog.title}
      <button type="button" onClick={toggleView}>
        {visible ? 'Hide' : 'View'}
      </button>
      {visible && (
        <div>
          {blog.author}
          <br />
          {blog.url}
          <br />
          Likes: {blog.likes}
          <button type="button" onClick={handleLike}>Like</button><br/>
          Added by: {blog.user.name}
          <br/>
        </div>
      )}
    </div>
  )
}

export default Blog
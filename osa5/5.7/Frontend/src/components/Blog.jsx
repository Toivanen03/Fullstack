import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const toggleView = () => {
    setVisible(!visible)
  }

  return (
    <div className="blogStyle">
      <br/>
      {blog.title} 
      <button type="button" onClick={toggleView}>
        {visible ? 'Hide' : 'View'}
      </button>
      {visible && (
        <div>
          {blog.author}<br/>
          {blog.url}<br/>
          Likes: {blog.likes}<button type="button">Like</button>
        </div>
      )}
    </div>
  )
}

export default Blog

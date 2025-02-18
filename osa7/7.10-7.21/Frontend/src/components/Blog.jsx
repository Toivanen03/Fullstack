import { useState } from "react"
import { useDispatch } from "react-redux"
import { likeBlog, deleteBlog } from "../redux/blogSlice"
import { setNotification, clearNotification } from "../redux/notificationSlice"

const Blog = ({ blog, currentUser }) => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()

  const handleLike = () => {
    if (!currentUser) {
      dispatch(
        setNotification({
          message: "You must be logged in to like a blog.",
          type: "error",
        })
      )
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
      return
    }

    dispatch(likeBlog(blog))
  }

  const handleDelete = () => {
    if (
      window.confirm(`Are you sure you want to delete blog "${blog.title}"?`)
    ) {
      dispatch(deleteBlog(blog.id))
    }
  }

  const toggleView = () => {
    setVisible(!visible)
  }

  return (
    <div className="blogStyle">
      <br />
      {blog.title}
      <button type="button" onClick={toggleView}>
        {visible ? "Hide" : "View"}
      </button>
      {visible && (
        <div>
          {blog.author}
          <br />
          {blog.url}
          <br />
          <span data-testid="likes-count">
            Likes: {blog.likes}
            <button onClick={handleLike}>Like</button>
          </span>
          <br />
          Added by: {blog.user.name}
          <br />
          {currentUser && currentUser.username === blog.user.username && (
            <button onClick={handleDelete}>Remove blog</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog

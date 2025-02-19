import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { deleteBlog, likeBlog, addComment } from "../redux/blogSlice"
import { setNotification } from "../redux/notificationSlice"
import { useState } from "react"

const BlogDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const blog = blogs.find((b) => b.id === id)
  const currentUser = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [comment, setComment] = useState("")

  if (!blog) return <p>Blog not found</p>

  const handleLike = () => {
    if (!currentUser) {
      dispatch(
        setNotification({
          message: "You must be logged in to like a blog.",
          type: "error",
        })
      )
      setTimeout(
        () => dispatch(setNotification({ message: "", type: "" })),
        5000
      )
      return
    }

    dispatch(likeBlog(blog))
    dispatch(
      setNotification({
        message: `You liked "${blog.title}"!`,
        type: "normal",
      })
    )
    setTimeout(() => dispatch(setNotification({ message: "", type: "" })), 5000)
  }

  const handleDelete = () => {
    if (
      window.confirm(`Are you sure you want to delete blog "${blog.title}"?`)
    ) {
      dispatch(deleteBlog(blog.id))
      dispatch(
        setNotification({
          message: `Blogi ${blog.title} poistettu!`,
          type: "normal",
        })
      )
      setTimeout(
        () => dispatch(setNotification({ message: "", type: "" })),
        5000
      )
      navigate("/")
    }
  }

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    if (comment.trim()) {
      dispatch(addComment({ id: id, comment: comment }))
      setComment("")
    }
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>
        URL:{" "}
        <a
          href={blog.url.startsWith("http") ? blog.url : `https://${blog.url}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {blog.url}
        </a>
      </p>
      <p>
        {blog.likes} likes <button onClick={handleLike}>Like</button>
      </p>
      <h3>Comments</h3>
      <ul>
        {blog.comments?.length > 0 ? (
          blog.comments.map((comment, index) => {
            return <li key={index}>{comment}</li>
          })
        ) : (
          <p>Ei kommentteja</p>
        )}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button type="submit">Lähetä</button>
      </form>
      <br />
      {currentUser && <button onClick={handleDelete}>Delete blog</button>}
    </div>
  )
}

export default BlogDetails

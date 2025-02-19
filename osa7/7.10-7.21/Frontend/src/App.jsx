import "../App.css"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchBlogs, createBlog } from "./redux/blogSlice"
import { setNotification, clearNotification } from "./redux/notificationSlice"
import { setUser } from "./redux/userSlice"
import Notification from "./components/Notification"
import blogService from "./services/blogs"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"
import Users from "./components/Users"
import User from "./components/User"
import Blogs from "./components/Blogs"
import BlogDetails from "./components/BlogDetails"
import Togglable from "./components/Togglable"
import Navigation from "./components/Navi"
import BlogForm from "./components/BlogForm"

const Content = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const blogFormRef = useRef()
  const location = useLocation()

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      dispatch(createBlog(blogObject))
      dispatch(setNotification({ message: "Blogi lisätty!", type: "normal" }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } catch (error) {
      dispatch(setNotification({ message: "Virhe", type: "error" }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }
  }

  return (
    <div>
      <br />
      {user && location.pathname === "/" && (
        <Togglable buttonLabel="New blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
      )}
      <Routes>
        <Route path="/" element={<Blogs blogs={blogs} user={user} />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/users" element={<Users />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
      </Routes>
    </div>
  )
}

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  return (
    <Router>
      <div>
        <h1>Blogs</h1>
        <Notification />
        <Navigation />
        <Content />
      </div>
    </Router>
  )
}

export default App

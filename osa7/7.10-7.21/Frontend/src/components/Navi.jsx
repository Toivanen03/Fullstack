import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../redux/userSlice"
import { setNotification, clearNotification } from "../redux/notificationSlice"
import Togglable from "./Togglable"
import LoginForm from "./LoginForm"
import loginService from "../services/login"
import { useState } from "react"
import blogService from "../services/blogs"
import { setUser } from "../redux/userSlice"

const Navigation = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const user = useSelector((state) => state.user)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
    } catch (exception) {
      dispatch(setNotification({ message: "Wrong credentials", type: "error" }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser")
    dispatch(logoutUser())
  }

  return (
    <nav className="navi">
      <ul>
        <li>
          <Link to="/">Blogs</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        {!user && (
          <Togglable buttonLabel="login">
            <LoginForm
              handleSubmit={handleLogin}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              username={username}
              password={password}
            />
          </Togglable>
        )}
        {user && (
          <div>
            {user.name} logged in
            <button onClick={handleLogout}>Log out</button>
          </div>
        )}
      </ul>
    </nav>
  )
}

export default Navigation

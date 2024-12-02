import '../App.css'
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [messageType, setMessageType] = useState('')
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('') 

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [user])

  if (!blogs) {
    return null
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessageType('error')
      setMessage('wrong credentials')
      timeout()
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
        <br/>
      </div>
      <div>
      password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <br/>
      <button type="submit">login</button>
    </form>      
  )

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <button type="submit">Log out</button>
    </form>  
  )

  const handleBlogPost = async (event) => {
    event.preventDefault()
    const newBlog = {
      title,
      author,
      url
    }
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setMessageType('normal')
      setMessage('Blog added!')
      timeout()
    } catch (exception) {
      setMessageType('error')
      setMessage('Failed to add blog')
      timeout()
    }
  }

  const timeout = () => (
    setTimeout(() => {
      setMessageType(null)
      setMessage(null)
    }, 3000)
  )

  const createBlog = () => (
    <form onSubmit={handleBlogPost}>
      <input
      type="text"
      value={title}
      name="Title"
      placeholder='Title'
      onChange={({ target }) => setTitle(target.value)}
      /><br/>
      <input
      type="text"
      value={author}
      name="Author"
      placeholder='Author'
      onChange={({ target }) => setAuthor(target.value)}
      /><br/>
      <input
      type="text"
      value={url}
      name="URL"
      placeholder='URL'
      onChange={({ target }) => setUrl(target.value)}
      /><br/>
      <button type="submit">Send</button>
    </form>  
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={message} type={messageType} />
      <h2>Login</h2>
      {!user && loginForm()} 
      {user && <div>
       <p>{user.name} logged in</p>
         {logoutForm()}
         <br/>
         <h3>Create new blog:</h3>
         {createBlog()}
         <h3>Blogs:</h3>
         {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
      }
    </div>
  )
}

export default App
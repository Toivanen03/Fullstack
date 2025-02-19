import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import userService from "../services/users"
import { useSelector } from "react-redux"

const UserDetails = () => {
  const [user, setUser] = useState(null)
  const users = useSelector((state) => state.users)
  const { id } = useParams()

  useEffect(() => {
    userService.getUser(id).then((user) => setUser(user))
  }, [id])

  if (!user) return <p>Loading...</p>

  return (
    <div>
      <h2>{user.username}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserDetails

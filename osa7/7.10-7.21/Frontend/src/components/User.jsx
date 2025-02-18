import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import userService from "../services/users"

const UserDetails = () => {
  const [user, setUser] = useState(null)
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
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserDetails

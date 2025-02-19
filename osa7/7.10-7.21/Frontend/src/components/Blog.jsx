import { Link } from "react-router-dom"

const Blog = ({ blog }) => {
  return (
    <div className="blogStyle">
      <br />
      <Link
        to={`/blogs/${blog.id}`}
        style={{ fontWeight: "bold", textDecoration: "none" }}
      >
        {blog.title}
      </Link>
      <span> by {blog.author}</span>
    </div>
  )
}

export default Blog

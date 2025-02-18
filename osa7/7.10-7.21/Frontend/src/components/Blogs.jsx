import Blog from "./Blog"

const Blogs = ({ blogs, user }) => {
  if (!blogs) return null

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <>
      {sortedBlogs.map((blog) => (
        <Blog key={blog.id} blog={blog} currentUser={user} />
      ))}
    </>
  )
}

export default Blogs

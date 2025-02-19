import { useState } from "react"

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle("")
    setAuthor("")
    setUrl("")
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <input
          data-testid="title"
          type="text"
          value={title}
          name="Title"
          placeholder="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
        <br />
        <input
          data-testid="author"
          type="text"
          value={author}
          name="Author"
          placeholder="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <br />
        <input
          data-testid="url"
          type="text"
          value={url}
          name="URL"
          placeholder="URL"
          onChange={({ target }) => setUrl(target.value)}
        />
        <br />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default BlogForm

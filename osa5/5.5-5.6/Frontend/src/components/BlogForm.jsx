import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState('')
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('') 

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setNewBlog('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
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
    </div>
  )
}

export default BlogForm
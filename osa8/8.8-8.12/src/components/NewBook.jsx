import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_BOOKS, ADD_BOOK } from '../queries'

const NewBook = ({ show }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genres, setGenres] = useState([])
  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    addBook({ variables: { title, author, published: parseInt(published), genres } })
    setTitle('')
    setAuthor('')
    setPublished('')
    setGenres([])
  }

  if (!show) return null

  return (
    <div>
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Title:
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          Author:
          <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          Published Year:
          <input value={published} onChange={(e) => setPublished(e.target.value)} />
        </div>
        <div>
          Genres (comma separated):
          <input value={genres} onChange={(e) => setGenres(e.target.value.split(','))} />
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  )
}

export default NewBook

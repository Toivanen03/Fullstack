import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_BOOKS, ADD_BOOK } from '../queries'

const NewBook = ({ show, setError, setPage }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    },
    update: (cache, response) => {
      if (response.data) {
        cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
          return {
            allBooks: allBooks.concat(response.data.addBook),
          }
        })
      }
    },
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    addBook({
      variables: { title, author, published: parseInt(published), genres: genres || [] }
    })
    setTitle('')
    setAuthor('')
    setPublished('')
    setGenres([])
    setPage('books')
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

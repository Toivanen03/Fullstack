import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_BOOKS, ADD_BOOK, ALL_AUTHORS } from '../queries'
import { useGenre } from './Genre'

const NewBook = ({ show, setMessage, setMessageType, setPage }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genres, setGenres] = useState([])
  const { setSelectedGenre } = useGenre()

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setMessageType('error')
      setMessage(messages)
    },
    update: (cache, response) => {
      const lastAddedGenres = response.data.addBook.genres
      setSelectedGenre(lastAddedGenres[0] || null)
      setMessageType('ok')
      setMessage(`${response.data.addBook.title} added!`)
      }
    },
  )

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
          <input value={genres} onChange={(e) => setGenres(e.target.value.split(',').map(g => g.trim()))} />
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  )
}

export default NewBook

import { useQuery } from '@apollo/client'
import { BOOK_ADDED, ALL_BOOKS, ALL_AUTHORS } from '../queries'
import { useSubscription } from '@apollo/client'
import { useGenre } from './Genre'
import { updateCache } from '../App'

const Books = ({ show, setMessage, setMessageType, setPage }) => {
  useSubscription(BOOK_ADDED, {
    onData: ({ client, data }) => {
      const addedBook = data.data.bookAdded
      setMessageType('ok')
      setMessage(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
      client.refetchQueries({ include: [ALL_BOOKS, ALL_AUTHORS] })
      setPage('books')
    },
  })

  const { selectedGenre, setSelectedGenre } = useGenre()
  const { loading, error, data } = useQuery(ALL_BOOKS)

  if (!show) return null

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const books = data.allBooks
  const allGenres = [...new Set(books.flatMap(book => book.genres))]
  const filteredBooks = selectedGenre 
    ? books.filter(book => book.genres.includes(selectedGenre))
    : books

  return (
    <div>
      <h2>Books</h2>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <br />
        <button onClick={() => setSelectedGenre(null)} key="all-genres">
          All genres
        </button>
        {allGenres.map((genre, index) => (
          <button
            key={`genre-${index}`}
            onClick={() => setSelectedGenre(genre)}
            style={{
              backgroundColor: selectedGenre === genre ? 'gray' : 'white',
              color: selectedGenre === genre ? 'white' : 'black',
            }}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
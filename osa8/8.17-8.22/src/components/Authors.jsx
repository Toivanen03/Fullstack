import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'

const Authors = ({ show }) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS)

  if (!show) return null

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
        </thead>
        <tbody>
          {data.allAuthors.map((author) => (
            <tr key={author.id}>
              <td>{author.name}</td>
              <td>{author.born ? author.born : 'Unknown'}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors

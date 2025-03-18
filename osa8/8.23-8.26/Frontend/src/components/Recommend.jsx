import { ALL_BOOKS, ME } from '../queries'
import { useQuery } from '@apollo/client'

const Recommend = ({ show }) => {
    const { data: meData, loading: meLoading, error: meError } = useQuery(ME)

    const favoriteGenre = meData?.me?.favoriteGenre
    const { data, loading, error } = useQuery(ALL_BOOKS, {
        variables: { genre: favoriteGenre },
        skip: !favoriteGenre
    })

    if (!show) return null
    if (meLoading || loading) return <div>Loading...</div>
    if (meError) return <div>Error: {meError.message}</div>
    if (error) return <div>Error: {error.message}</div>

    return (
        <div>
            <h2>Recommendations</h2>
            <p>Books in your favorite genre: <strong>{favoriteGenre ? favoriteGenre : 'You have no favorite genre.'}</strong></p>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Published</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.allBooks.map((book) => (
                        <tr key={book.id}>
                            <td>{book.title}</td>
                            <td>{book.author.name}</td>
                            <td>{book.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Recommend
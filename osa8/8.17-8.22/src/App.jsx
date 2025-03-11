import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import AuthorBirthYear from './components/AuthorBirthYear'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const { data } = useQuery(ALL_AUTHORS)

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('birthYear')}>set author birth year</button>
      </div>

      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <AuthorBirthYear show={page === 'birthYear'} authors={data ? data.allAuthors : []} />
    </div>
  )
}

export default App

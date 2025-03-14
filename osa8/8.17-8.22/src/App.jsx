import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import AuthorBirthYear from './components/AuthorBirthYear'
import { useQuery, useApolloClient } from '@apollo/client'
import { ALL_AUTHORS } from './queries'
import Login from './components/Login'
import Recommend from './components/Recommend'
import { GenreProvider } from './components/Genre'

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()
  const { data } = useQuery(ALL_AUTHORS, {
    pollInterval: 2000
  })
  
  const Notify = ({errorMessage}) => {
    if ( !errorMessage ) {
      return null
    }
    return (
      <div style={{color: 'red'}}>
        {errorMessage}
      </div>
    )
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  if (!token) {
    return (
      <GenreProvider>
        <div>
          <div>
            <button onClick={() => setPage('authors')}>authors</button>
            <button onClick={() => setPage('books')}>books</button>
            <button onClick={() => setPage('login')}>login</button>
          </div>

          <Notify errorMessage={errorMessage} />
          <Authors show={page === 'authors'} />
          <Books show={page === 'books'} />
          <Login show={page === 'login'} setError={notify} setToken={setToken} setPage={setPage} />
        </div>
      </GenreProvider>
    )
  }

  return (
    <GenreProvider>
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('birthYear')}>set author birth year</button>
          <button onClick={() => setPage('recommend')}>recommend</button>
          <button onClick={logout}>logout</button>
        </div>

        <Notify errorMessage={errorMessage} />
        <Authors show={page === 'authors'} />
        <Books show={page === 'books'} />
        <NewBook show={page === 'add'} setError={notify} setPage={setPage} />
        <AuthorBirthYear show={page === 'birthYear'} authors={data ? data.allAuthors : []} setError={notify} setPage={setPage} />
        <Recommend show={page === 'recommend'} setError={notify} />
      </div>
    </GenreProvider>
  )
}

export default App

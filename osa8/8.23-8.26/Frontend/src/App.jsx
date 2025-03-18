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

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  const [message, setMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()
  const { result } = useQuery(ALL_AUTHORS)
  const [messageType, setMessageType] = useState(null)

  const Notify = ({message}) => {
    if ( !message ) {
      return null
    }
    return (
      <div style={{
        color: messageType === 'ok' ? 'green' : 'red',
        fontSize: '30px'}}>
        {message}
      </div>
    )
  }

  const notify = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
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

          <Notify message={message} />
          <Authors show={page === 'authors'} />
          <Books show={page === 'books'} setMessage={notify} setMessageType={setMessageType} setPage={setPage} />
          <Login show={page === 'login'} setMessage={notify} setMessageType={setMessageType} setToken={setToken} setPage={setPage} />
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

        <Notify message={message} />
        <Authors show={page === 'authors'} />
        <Books show={page === 'books'} setMessage={notify} setMessageType={setMessageType} setPage={setPage} />
        <NewBook show={page === 'add'} setMessage={notify} setMessageType={setMessageType} setPage={setPage} />
        <AuthorBirthYear show={page === 'birthYear'} authors={result ? result.allAuthors : []} setMessage={notify} setMessageType={setMessageType} setPage={setPage} />
        <Recommend show={page === 'recommend'} />
      </div>
    </GenreProvider>
  )
}

export default App

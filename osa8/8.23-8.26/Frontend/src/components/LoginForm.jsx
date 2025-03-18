import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
const pwd = 'supersecretkey'
const user = 'retrogamer'

const LoginForm = ({ setMessage, setMessageType, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setMessageType('error')
      if (error.graphQLErrors.length > 0) {
        setMessage(error.graphQLErrors[0].message)
      } else {
        setMessage(error.message)
      }
    }
  })

  useEffect(() => {
    if (result.data) {
        const token = result.data.login.value
        setToken(token)
        sessionStorage.setItem('library-user-token', token)
        setMessageType('ok')
        setMessage(`${username} logged in!`)
        setPage('authors')
    }
  }, [result.data])  

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(user)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(pwd)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
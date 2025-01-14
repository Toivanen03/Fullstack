import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const setNotificationMessage = (anecdote) => {
    dispatch(setNotification(`Lisäsit anekdootin "${anecdote}"`))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  const createNewAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    dispatch(createAnecdote(content))
    event.target.anecdote.value = ''
    setNotificationMessage(content)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createNewAnecdote}>
        <div>
          <input name="anecdote" />
          <button>create</button>
        </div>
      </form>
    </div>
  )
}

export default AnecdoteForm
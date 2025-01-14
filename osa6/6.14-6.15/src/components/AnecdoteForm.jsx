import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const setNotificationMessage = (anecdote) => {
    dispatch(setNotification(`Lisäsit anekdootin "${anecdote}"`))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  const createNewAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
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
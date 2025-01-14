import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()

    const setNotificationMessage = (anecdote) => {
      dispatch(setNotification(`Äänestit "${anecdote.content}"`))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }
  
    const anecdotes = useSelector(({ anecdotes, filter }) => {
      if (!filter) return anecdotes
      return anecdotes.filter(anecdote =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase())
      )
    })
  
    const vote = (id) => {
      const anecdote = anecdotes.find(a => a.id === id)
      dispatch(voteAnecdote(id))
      setNotificationMessage(anecdote)
    }

    const anecdotesSortedByVotes = anecdotes.slice().sort((a, b) => b.votes - a.votes)

    return (
        <div>
          {anecdotesSortedByVotes.map(anecdote => (
            <div key={anecdote.id}>
              <div>
                {anecdote.content}
              </div>
              <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote.id)}>vote</button>
              </div>
            </div>
          ))}
        </div>
      )
    }

export default AnecdoteList
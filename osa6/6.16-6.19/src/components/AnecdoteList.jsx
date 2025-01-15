import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { initializeNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteList = () => {
    const dispatch = useDispatch()
  
    const anecdotes = useSelector(({ anecdotes, filter }) => {
      if (!filter) return anecdotes
      return anecdotes.filter(anecdote =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase())
      )
    })
  
    const vote = async (id) => {
      const anecdote = anecdotes.find(a => a.id === id)
      const updatedAnecdote = await anecdoteService.update(id, { ...anecdote, votes: anecdote.votes + 1 })
      dispatch(voteAnecdote(updatedAnecdote))
      dispatch(initializeNotification(`Äänestit "${anecdote.content}"`, 5))
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
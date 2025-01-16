import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotification } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useNotification()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))

      dispatch({ type: 'SHOW_NOTIFICATION', message: `Created new anecdote: ${newAnecdote.content}` })
      setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 5000)
    },
    onError: (error) => {
      dispatch({ type: 'SHOW_NOTIFICATION', message: `Error: ${error.response?.data.error || error.message}` })
      setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value.trim()
    if (content.length < 5) {
      dispatch({ type: 'SHOW_NOTIFICATION', message: 'Anekdootin on oltava vähintään viisi merkkiä.' })
      setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 5000)
      return
    }
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
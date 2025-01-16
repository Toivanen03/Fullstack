import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote = async (newAnecdote) => {
  try {
    const response = await axios.post(baseUrl, newAnecdote)
    return response.data
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error('Anekdootin on oltava vähintään viisi merkkiä.')
    }
  }
}

export const voteAnecdote = (anecdote) =>
  axios.put(`${baseUrl}/${anecdote.id}`, anecdote).then(res => res.data)

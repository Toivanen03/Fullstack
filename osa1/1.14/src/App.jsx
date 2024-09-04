import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [max, setMax] = useState(0)

  const getRandom = () => {
    const index = Math.floor(Math.random() * anecdotes.length)
    setSelected(index)
  }

  const vote = () => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    setVotes(votesCopy)
    updateMax(votesCopy)
  }

  const updateMax = (votes) => {
    const maxVotes = Math.max(...votes)
    if (votes[selected] === maxVotes) {
      setMax(selected)
    }
  }  

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <p>Has {votes[selected]} votes</p>
      <Button handleClick={getRandom} text="Next anecdote" />
      <Button handleClick={vote} text="Vote this" />
      {votes[max] > 0 && (
      <div>
        <h2>Anecdote with most votes</h2>
        <p>{anecdotes[max]}</p>
        <p>Has {votes[max]} votes</p>
      </div>
    )}
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

export default App
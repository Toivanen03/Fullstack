import { useState } from 'react'

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [average, setAverage] = useState(0)
  const [positivePercentage, setPositive] = useState(0) 

  const updateValues = (type) => {
    const values = { good, neutral, bad }
    values[type] += 1

    return values
  }
  
  const vote = (type) => {
    const updatedValues = updateValues(type)
  
    setGood(updatedValues.good)
    setNeutral(updatedValues.neutral)
    setBad(updatedValues.bad)
  
    const all = updatedValues.good + updatedValues.neutral + updatedValues.bad
    setAverage((updatedValues.good - updatedValues.bad) / all)
    setPositive(updatedValues.good / all * 100)
  }
  

  return (
    <div>
      <h1>Give feedback:</h1>

      <Button handleClick={() => vote('good')} text="Good" />
      <Button handleClick={() => vote('neutral')} text="Neutral" />
      <Button handleClick={() => vote('bad')} text="Bad" />

      <h2>Statistics:</h2>
      
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>All: {good + neutral + bad}</p>
      <p>Average: {average}</p>
      <p>Positive: {positivePercentage}%</p>
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

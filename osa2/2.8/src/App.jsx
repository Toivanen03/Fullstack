import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '1234567' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = event => {
    event.preventDefault()

    const person = persons.find(person => person.name === newName)
    if (person) {
      alert(`Nimi ${newName} on jo olemassa`)
      setNewName('')
      setNewNumber('')
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
    }

  setPersons(persons.concat(personObject))
  setNewName('')
  setNewNumber('')
  }

  const addName = (event) => {
    setNewName(event.target.value)
  }

  const addNumber = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          <div>name: <input value={newName} onChange={addName}/></div>
          <div>number: <input value={newNumber} onChange={addNumber}/></div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person, index) => (
          <li key={index}>{person.name} {person.number}</li>
        ))}
      </ul>
      <div>debug: {newName} {newNumber}</div>
    </div>
  )

}

export default App
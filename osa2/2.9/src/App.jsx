import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

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

  const filter = (event) => {
    setSearch(event.target.value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
      <div>Filter: <input value={search} onChange={filter}/></div>
      <h2>Add new</h2>
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
      {filteredPersons.map((person, index) => (
          <li key={index}>{person.name} {person.number}</li>
        ))}
      </ul>
      <div>debug: {newName} {newNumber}</div>
    </div>
  )

}

export default App
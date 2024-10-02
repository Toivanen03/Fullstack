import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = event => {
    event.preventDefault()

    const personExists = persons.find(person => person.name === newName)
    if (personExists) {
      if (window.confirm(`Nimellä ${newName} on jo puhelinnumero. Korvataanko numero uudella?`)) {
        const updatedPerson = { ...personExists, number: newNumber }
        personService
          .update(personExists.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => (person.id !== returnedPerson.id ? person : returnedPerson)))
            setNewName('')
            setNewNumber('')
          })
        }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.error('Error adding person:', error)
        alert('Virhe henkilön lisäämisessä')
      })
  }

  const filter = (event) => {
    setSearch(event.target.value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} onFilter={filter} />
      <h3>Add a new</h3>
      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} setPersons={setPersons} />
    </div>
  )
}

export default App
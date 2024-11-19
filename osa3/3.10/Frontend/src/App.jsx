import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('ok')

  useEffect(() => {
    personService.getAll()
    .then(initialPersons => {
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
            showNotification(`Henkilön ${returnedPerson.name} numero muutettu`)
          })
          .catch(error => {
            setNotificationType('error')
            showNotification(`Nimi on jo poistettu\nVirhe ${error}`)
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
        showNotification(`Lisätty nimi ${returnedPerson.name}`)
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

  const showNotification = (message, type) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
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
      <Persons persons={filteredPersons} setPersons={setPersons} showNotification={showNotification} />
    </div>
  )
}

export default App
import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import People from './components/People'
import personService from './services/people'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [people, setPeople] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('ok')

  useEffect(() => {
    personService.getAll()
    .then(initialPeople => {
      setPeople(initialPeople)
    })
  }, [])

  const addPerson = event => {
    event.preventDefault()

    const personExists = people.find(person => person.name === newName)
    if (personExists) {
      if (window.confirm(`Nimellä ${newName} on jo puhelinnumero. Korvataanko numero uudella?`)) {
        const updatedPerson = { ...personExists, number: newNumber }
        personService
          .update(personExists.id, updatedPerson)
          .then(returnedPerson => {
            setPeople(people.map(person => (person.id !== returnedPerson.id ? person : returnedPerson)))
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
        setPeople(people.concat(returnedPerson))
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

  const filteredPeople = people.filter(person =>
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
      <People people={filteredPeople} setPeople={setPeople} showNotification={showNotification} />
    </div>
  )
}

export default App
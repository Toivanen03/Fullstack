import React from 'react'
import personService from '../services/people'
import PersonForm from './PersonForm'

const People = ({ people, setPeople, showNotification }) => {
  const handleDelete = (id) => {
    const nameToDelete = people.find(person => person.id === id)
    if (window.confirm('Haluatko varmasti poistaa tämän yhteystiedon?')) {
      personService.remove(id)
        .then(() => {
          setPeople(people.filter(person => person.id !== id))
          showNotification(`Henkilön ${nameToDelete.name} yhteystieto poistettu`)
        })
        .catch(error => {
          console.error('Virhe poistettaessa yhteystietoa:', error)
        })
    }
  }

  return (
    <ul>
      {people.map((person) => (
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>Poista</button>
        </li>
      ))}
    </ul>
  )
}

export default People
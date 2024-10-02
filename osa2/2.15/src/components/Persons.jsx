import React from 'react'
import personService from '../services/persons'

const Persons = ({ persons, setPersons }) => {
  const handleDelete = (id) => {
    if (window.confirm('Haluatko varmasti poistaa tämän yhteystiedon?')) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.error('Virhe poistettaessa yhteystietoa:', error)
        })
    }
  }

  return (
    <ul>
      {persons.map((person) => (
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>Poista</button>
        </li>
      ))}
    </ul>
  )
}

export default Persons
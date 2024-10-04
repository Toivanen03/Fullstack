import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CountriesList from './CountriesList'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (searchTerm) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          const filteredCountries = response.data.filter(country => 
            country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
          )
          
          setCountries(filteredCountries)
        })
        .catch(error => {
          console.error("Error fetching countries:", error)
          setCountries([])
        })
    } else {
      setCountries([])
    }
  }, [searchTerm])


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleShowCountry = (country) => {
    setSearchTerm(country.name.common)
  }

  return (
    <div>
      <h1>Maahaku</h1>
      <input
        type="text"
        placeholder="Etsi maata:"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <CountriesList countries={countries} handleShowCountry={handleShowCountry}/>
    </div>
  )
}

export default App
import React from 'react'
import Country from './Country'

const CountriesList = ({ countries }) => {
  if (countries.length > 10) {
    return <p>Liikaa maita, tarkenna hakua.</p>
  } else if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.cca3}>
            {country.name.common}
          </li>
        ))}
      </ul>
    )
  } else if (countries.length === 1) {
    return <Country country={countries[0]} />
  } else {
    return null
  }
}

export default CountriesList

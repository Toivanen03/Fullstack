import React from 'react'

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <br />
      <p>Pääkaupunki {country.capital}</p>
      <p>Pinta-ala {country.area} km²</p>
      <img src={country.flags.png} alt={`Lippu ${country.name.common}`} width="150" />
      <h3>Kielet:</h3>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
    </div>
  )
}

export default Country

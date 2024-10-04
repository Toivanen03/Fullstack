import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)
  useEffect(() => {    
    const apiKey = import.meta.env.VITE_API_KEY
    const capital = country.capital
    const suffix = country.cca2
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital},${suffix}&APPID=${apiKey}&units=metric`

    axios
      .get(url)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.error('Haku epäonnistui: ', error)
      })
    }, [country.capital]
  )

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
      <h3>Sää {country.capital}</h3>
      {weather ? (
        <div>
          <p>Lämpötila: {weather.main.temp} °C</p>
          <p>Säätila: {weather.weather[0].description}</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="Weather icon" />
        </div>
      ) : (
        <p>Ladataan säätietoja</p>
      )}
    </div>
  )
}

export default Country

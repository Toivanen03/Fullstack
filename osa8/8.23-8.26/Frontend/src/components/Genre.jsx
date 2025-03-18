import React, { createContext, useState, useContext } from 'react'

const GenreContext = createContext()

export const GenreProvider = ({ children }) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  
  return (
    <GenreContext.Provider value={{ selectedGenre, setSelectedGenre }}>
      {children}
    </GenreContext.Provider>
  )
}

export const useGenre = () => {
  return useContext(GenreContext)
}

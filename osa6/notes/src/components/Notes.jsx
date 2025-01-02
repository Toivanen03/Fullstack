import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleImportanceOf } from '../reducers/noteReducer'

const Notes = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => state)

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id))
  }

  return (
    <ul>
      {notes.map(note => (
        <li key={note.id}>
          {note.content} <strong>{note.important}</strong>
          <button onClick={() => toggleImportance(note.id)}>
            {note.important ? 'Make not important' : 'Make important'}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default Notes
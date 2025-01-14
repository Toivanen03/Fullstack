import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleImportanceOf } from '../reducers/noteReducer'

const Note = ({ note, handleClick }) => {
  return (
    <li>
      {note.content + " "} 
      <button onClick={handleClick}>
        {note.important ? 'Make not important' : 'Make important'}
      </button>
    </li>
  )
}

const Notes = () => {
  const dispatch = useDispatch()
  const notes = useSelector(({ filter, notes }) => {
    if ( filter === 'ALL' ) {
      return notes
    }
    return filter  === 'IMPORTANT' 
      ? notes.filter(note => note.important)
      : notes.filter(note => !note.important)
  })

  return (
    <ul>
      {notes.map(note =>
        <Note
        key={note.id}
        note={note}
        handleClick={() => 
          dispatch(toggleImportanceOf(note.id))
        }
      />
    )}
  </ul>
  )
}

export default Notes
import { createStore } from 'redux'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

export default store
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import { useField } from './hooks'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to='/' style={padding}>anecdotes</Link>
      <Link to='/create' style={padding}>create new</Link>
      <Link to='/about' style={padding}>about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </div>
)

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id
  const anecdote = anecdotes.find(a => a.id === Number(id))

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <p>by {anecdote.author}</p>
      <p>has {anecdote.votes} votes</p>
      <p>For more info see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account of an individual person or an incident...
    </em>
    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const CreateNew = ({ addNew, setNotification }) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    setNotification(`A new anecdote "${content.value}" created!`)
    setTimeout(() => setNotification(''), 5000)
    navigate('/')
  }

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content <input value={content.value} onChange={content.onChange} type={content.type} />
        </div>
        <div>
          author <input value={author.value} onChange={author.onChange} type={author.type} />
        </div>
        <div>
          url for more info <input value={info.value} onChange={info.onChange} type={info.type} />
        </div>
        <button>create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

const Notification = ({ message }) => {
  if (!message) return null
  return <div style={{ border: '1px solid green', padding: '10px', marginBottom: '10px' }}>{message}</div>
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Notification message={notification} />
        <Routes>
          <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path='/create' element={<CreateNew addNew={addNew} setNotification={setNotification} />} />
          <Route path='/about' element={<About />} />
          <Route path='/anecdotes/:id' element={<Anecdote anecdotes={anecdotes} />} />
        </Routes>
      </div>
      <div>
        Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
        See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>source code</a>.
      </div>
    </Router>
  )
}

export default App

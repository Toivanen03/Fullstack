require('dotenv').config()
const Note = require('./models/note.js')

const express = require('express')
const app = express()
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

app.get('/', (request, response) => {
    response.send('<h1>Moikkuli moi!</h1>')
  })

  app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
  })

  app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                response.status(204).end()
            } else {
                response.status(404).send({ error: 'Note not found' })
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).send({ error: 'Server error' })
        })
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
    if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
  })

  const generateId = () => {
    const maxId = Note.find({}).length > 0
      ? Math.max(maxId(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }
  
  app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
      id: generateId(),
    })
  
    note.save().then(savedNote => {
    response.json(savedNote)
  })
})

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
const Note = require('./models/note.js')

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
      }
    })
    .catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
  .then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).send({ error: 'Note not found' })
    }
  })
    .catch(error => next(error))
})
  
app.post('/api/notes', (request, response, next) => {
  const body = request.body
  
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  
  note.save()
  .then(savedNote => {
    response.json(savedNote)
  })
  .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body
  Note.findByIdAndUpdate(request.params.id, { content, important },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
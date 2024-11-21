require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
const Person = require('./models/person.js')
const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

morgan.token('body', function(req) {
  return JSON.stringify(req.body)
})

app.use((request, response, next) => {
  if (request.method === 'POST') {
    morgan(':method :url :status :response-time ms :body')(request, response, next)
  } else {
    morgan('tiny')(request, response, next)
  }
})

app.get('/info', (request, response) => {
  response.send(`
    <p>${new Date().toString()}</p>
  `)
})

app.get('/api/people', (request, response, next) => {
  Person.find({})
  .then(people => {
    response.json(people)
  })
  .catch(error => next(error))
})

app.get('/api/people/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
        response.json(person)
      }
    })
  .catch(error => next(error))
})

app.delete('/api/people/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
  .then(result => {
      if (result) {
          response.status(204).end()
      }
  })
  .catch(error => next(error))
})
  
app.post('/api/people', (request, response, next) => {
  const body = request.body
  
  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'Number missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number || false,
  })

  person.save()
    .then(savedContact => {
      response.json(savedContact)
      })
    .catch (error => next(error))
})

app.put('/api/people/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true})
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted ID' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }
  return response.status(500).send({ error: 'Internal Server Error' });
};

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
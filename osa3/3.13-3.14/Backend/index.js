const express = require('express')
const morgan = require('morgan')

require('dotenv').config()
const Person = require('./models/person.js')

const app = express()

app.use(express.json())

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

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

app.get('/info', (request, response) => {
  response.send(`
    <p>${new Date().toString()}</p>
  `)
})

app.get('/api/people', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/people/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
  })

app.delete('/api/people/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
  .then(result => {
      if (result) {
          response.status(204).end()
      } else {
          response.status(404).send({ error: 'Contact not found' })
      }
  })
  .catch(error => {
      console.error(error);
      response.status(500).send({ error: 'Server error' })
  })
})


const getRandomId = () => {
  return String(Math.floor(Math.random() * 999))
}
  
app.post('/api/people', (request, response) => {
  const body = request.body
  
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number || false,
    id: getRandomId(),
  })

  person.save().then(savedContact => {
  response.json(savedContact)
})
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const express = require('express')
const morgan = require('morgan')

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

  let persons = [
    {
        id: "1",
        name: "Jorma Yrjölä",
        number: "1234567"
    },
    {
        id: "2",
        name: "Esko Erkkilä",
        number: "2345678"
    },
    {
        id: "3",
        name: "Matias Myyrä",
        number: "3456789"
    },
    {
        id: "4",
        name: "Simo Siili",
        number: "4567890"
    }
  ]

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})


const getRandomId = () => {
  return String(Math.floor(Math.random() * 999))
}
  
app.post('/api/persons', (request, response) => {
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

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    });
  }

  const person = {
    id: getRandomId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
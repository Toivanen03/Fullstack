const express = require('express')
const app = express()
app.use(express.json())

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

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
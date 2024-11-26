const notesRouter = require('express').Router()
const Note = require('../models/note.js')

notesRouter.get('/', async (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

notesRouter.put('/:id', async (request, response, next) => {
  const { content, important } = request.body
  Note.findByIdAndUpdate(request.params.id, { content, important },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.status(201).json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

app.get('/info', (request, response) => {
  response.send(`<div>The phonebook has ${persons.length} people in it.</div>
                 <br />
                 <div>${new Date()}</div>`)
  
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(person.toJSON())
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: 'the name or number is missing'
    })
  }

  const personToAdd = new Person({
    name: body.name,
    number: body.number,
  })

  personToAdd
    .save()
    .then(newPerson => {
      response.json(newPerson.toJSON())
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const personToDeleteId = Number(request.params.id)
  persons = persons.filter(person => person.id !== personToDeleteId)
  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`)
})
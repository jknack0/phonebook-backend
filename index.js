const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "My friend jonathon lopez",
    "number": "123",
    "id": 7
  }
]

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(person => person.id))
    : 0
  return maxId + 1
}

app.get('/info', (request, response) => {
  response.send(`<div>The phonebook has ${persons.length} people in it.</div>
                 <br />
                 <div>${new Date()}</div>`)
  
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const personToGetId = Number(request.params.id)
  const person = persons.find(person => person.id === personToGetId)
  response.json(person)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: 'the name or number is missing'
    })
  }

  if(!persons.map(person => person.name.toLowerCase().includes(body.name.toLowerCase()))) {
    return response.status(400).json({
      error: 'this name is already in the phonebook'
    })
  }

  const personToAdd = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(personToAdd)

  response.json(personToAdd)
  
})

app.delete('/api/persons/:id', (request, response) => {
  const personToDeleteId = Number(request.params.id)
  persons = persons.filter(person => person.id !== personToDeleteId)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`)
})
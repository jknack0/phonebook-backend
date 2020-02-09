const express = require('express')

const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const errorHandler = require('./middleware/errorHandler')

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

app.get('/info', (request, response) => {
  response.send(`<div>The phonebook has a lot of people in it.</div>
                 <br />
                 <div>${new Date()}</div>`)
  
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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

  personToAdd.save()
    .then(newPerson => {
      response.json(newPerson.toJSON())
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  
  const personToUpdate = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, personToUpdate, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`)
})

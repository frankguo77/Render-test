require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()


app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))


const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
  //console.error(error.message)
  console.error('error: ', error.name)

  if (error.name === 'CastError') {
      return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
      return response.status(400).send({error: error.message})
  }
  
  next(error)
}

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log('Post:',body)

    const people = new Person ({
        name: body.name,
        number: body.number,
        // id: Math.floor(Math.random() * 1000000000000)
    })

    // persons = [...persons, people]
    people.save()
    .then(saved => {
        response.json(saved)
    })
    .catch(error => {
      //console.log("Post Error: ", error)
      next(error)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})


app.get('/api/persons/:id',(request, response, next) => {
  console.log("Get", request.params.id)
    Person.findById(request.params.id)
    .then(person =>{
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      //console.log('Get error:' , error)
      next(error)
    })
})

app.delete('/api/persons/:id',(request, response,next) => {
    console.log('deleting: ', request.params.id)
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    {name: name, number: number},
    {new: true, runValidators:true, context: 'query'}
  )
  .then(updated => {
    response.json(updated)
  })
  .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})

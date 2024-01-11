const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
let persons = [
    {
        id: 1,
        name:"Arto Hellas",
        number: "040-12345"
    },
    {
        id: 2,
        name:"Ada Lovelace",
        number: "39-44-5233523"
    },
    {
        id: 3,
        name:"Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name:"Mary Proppendick",
        number: "39-23-6423122"
    },
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({error: 'name missing'})
    }

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({error: 'name must be unique'})
    }

    const people = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000000000000)
    }

    persons = [...persons, people]
    response.json(people)
})

app.get('/api/persons/:id',(request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const people = persons.find(people => people.id === id)
    
    if (people) {
        response.json(people)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id',(request, response) => {
    const id = Number(request.params.id)
    console.log('deleting: ', id)
    persons = persons.filter(people => people.id !== id)
    
    response.status(204).end()
})

app.get('/info', (request, response) => {
    response.send(`<p>Ponebook has info for ${persons.length} people</p>${new Date().toString()}`)
})

const PORT = 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})

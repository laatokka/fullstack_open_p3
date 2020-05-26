const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')

app.use(cors())
app.use(express.json())

const getPost = (req, res, next) => {
    next()
}

morgan.token('post-contents', (req) => {
    return JSON.stringify(req.body)
})

app.use(getPost)

//manual tiny configuration + POST
app.use(morgan(':method :url :status :res[content-length] - :response-time  :post-contents'))

let persons = [
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 1
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 2
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 3
    },
    {
        "name": "Adam Merigold",
        "number": "12-23-8875",
        "id": 4
    },
    {
        "name": "Adam Hasselnut",
        "number": "822-8223-8334",
        "id": 5
    },
    {
        "name": "Banjo Guitarro",
        "number": "407741123",
        "id": 6
    }
]


const userExists = (name) => {
    const person = persons.find(p => p.name === name)
    if (person) {
        return true
    }

    return false
}

const generateRandomID = () => {
    return Math.floor(Math.random() * Math.floor(10000000));
}

app.get('/', (req, res) => {
    res.redirect('/api/persons')
})

app.get('/api/persons', (req, res) => {
    res.send(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find((p) => p.id === id)

    if (person) {
        return res.send(person)
    } else {
        res.status(404).send()
    }
})

app.get('/info', (req, res) => {
    const numOfRecords = persons.length
    const date = Date()

    res.write(`Phonebook has info for ${numOfRecords} people.`)
    res.write('\n')
    res.write('\n')
    res.write(`${date}`)
    res.end()
})

app.post('/api/persons', (req, res) => {
    const id = generateRandomID()
    const body = req.body

    if (!body) {
        return res.status(400).json({
            error: "No content!"
        })
    }
    const { name, number } = body
    const person = { name, number, id }

    if (userExists(person.name)) {
        return res.status(409).json({
            error: "Name is already in the phonebook!"
        })
    }

    if (!name || !number) {
        return res.status(400).json({
            error: "Make sure that name AND number are correct."
        })
    }

    persons = persons.concat(person)

    res.json(person)

})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is now up running on port ${PORT}`)
})
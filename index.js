require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')

const getPost = (req, res, next) => {
    next()
}

morgan.token('post-contents', (req) => {
    return JSON.stringify(req.body)
})

app.use(getPost)
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

//manual tiny configuration + POST
app.use(morgan(':method :url :status :res[content-length] - :response-time  :post-contents'))

const generateRandomID = () => {
    return Math.floor(Math.random() * Math.floor(10000000));
}

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            }
            else {
                res.status(404).end()
            }
        }).catch(error => next(error))
})

app.get('/', (req, res) => {
    res.redirect('/api/persons')
})

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(p => {
        res.json(p)
    }).catch((e) => next(error))
})

app.get('/info', (req, res, next) => {
    const date = Date()
    Person.find({})
        .then(p => {
            res.write(`Phonebook has info for ${p.length} people`)
            res.write('\n')
            res.write('\n')
            res.write(`Date: ${date}`)
            res.send()
        })
        .catch(error => next(error))

})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            error: "No content!"
        })
    }
    const { name, number } = body
    const person = new Person({ name, number })

    if (!name && !number) {
        return res.status(400).json({
            error: "Make sure that name AND number are correct."
        })
    }

    person.save()
        .then(savedPerson => res.json(savedPerson))
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {

    const person = { name, number } = req.body

    console.log(req.params.id)
    console.log(person)

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

//#region Error handling
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint.' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Id is not in correct form' })
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

//#endregion


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is now up running on port ${PORT}`)
})
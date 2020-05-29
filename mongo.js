
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phoneNum = process.argv[4]
//const url = `mongodb+srv://fullstack:${password}@cluster0-ilt3i.mongodb.net/phonebook?retryWrites=true&w=majority`

console.log("password argv:", process.argv[2])
console.log("name argv:", process.argv[3])
console.log("phone argv:", process.argv[4])

const url = `mongodb+srv://fullstack:${password}@cluster0-ilt3i.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then((s) => {
    console.log('Success!')
}).catch((e) => {
    console.log(e)
    console.log('something went wrong')
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    number: phoneNum,
})

if (password && !name) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(p => {
            console.log(p.name, p.number)
        })
        mongoose.connection.close()
    })
}

if (password && name && phoneNum) {
    person.save().then(result => {
        console.log(`added ${name} number ${phoneNum} to phonebook`)
        mongoose.connection.close()
    }).catch((e) => {
        console.log(e)
    })
}



const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to db...')

mongoose.connect(url)
.then(result => {
    console.log('database connected')
})
.catch((error) => {
    console.log('error connecting to database: ', error.message)
})

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String
    },
    dateofbirth: {
        type: String
    },
    jobtitle: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    phonenumber: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type: String
    }
})

employeeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

employeeSchema.plugin(validator)
module.exports = mongoose.model('Employee', employeeSchema)
require('dotenv').config()
require('express-async-errors')
const express = require('express')
const Employee = require('./models/employees')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
var mongoose = require('mongoose'); 
const middleware = require('./utils')
app.use(express.static('dist'))

app.get('/api/employees', (request, response) => {
    Employee
        .find({})
        .then(employees => {
            response.json(employees)
        })
})

app.post('/api/employees', async (request, response) => {
    const body = request.body
    const newEmployee = new Employee({
        firstname: body.firstname,
        lastname: body.lastname,
        dateofbirth: body.dateofbirth,
        jobtitle: body.jobtitle,
        email: body.email,
        phonenumber: body.phonenumber,        
        address: body.address
    })
    if(!newEmployee.firstname || !newEmployee.jobtitle || !newEmployee.phonenumber){
        return response.status(400)
        .json({
            error: "Please fill in all the required fields"
        })
    }
    const saved_employee = await newEmployee.save()
    response.status(201).json(saved_employee)
})

app.delete('/api/employees/:id', async (request, response) => {
    const { id } = request.params;
    const post = await Employee.findById(id).exec()
    await post.deleteOne()
    response.status(204).end()
})

app.put('/api/employees/:id', async(request, response) => {
    const { firstname,
            lastname,
            phonenumber,
            email,
            address,
            jobtitle } = request.body

    if(!firstname || !jobtitle || !phonenumber){
        return response.status(400)
            .json({
                error: "Please fill in all the required fields"
            })
    }

    await Employee.findByIdAndUpdate(request.params.id,
        { firstname, lastname, phonenumber, email, address, jobtitle },
        { new: true, runValidators: true, context:'query' })
    response.status(200).json(request.body)
})

app.use(middleware.errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server running on PORT ${process.env.PORT}`)
})


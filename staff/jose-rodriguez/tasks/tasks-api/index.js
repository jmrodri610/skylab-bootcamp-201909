const express = require('express')
const bodyParser = require('body-parser')
const { name, version } = require('./package.json')
const users = require('./data/users')()
const { registerUser, authenticateUser, retrieveUser } = require('./logic')
const { ConflictError, CredentialsError, NotFoundError } = require('./utils/errors')

const api = express()

const jsonBodyParser = bodyParser.json()

const { argv: [, , port = 8080] } = process

api.post('/users', jsonBodyParser, (req, res) => {
    const { body: { name, surname, email, username, password } } = req

        try {
            registerUser(name,surname,email,username,password)
                .then( ()=> res.json({message: 'user successfully registered'}))
                .catch( error => {
                    if (error instanceof ConflictError)
                        return res.status(409).json({message: error.message})

                    res.status(500).json({message: error.message})
                })
            
        } catch ({message}) {
            res.status(400).json({message})
        }

})

users.load()
    .then(() => api.listen(port, () => console.log(`${name} ${version} up and running on port ${port}`)))


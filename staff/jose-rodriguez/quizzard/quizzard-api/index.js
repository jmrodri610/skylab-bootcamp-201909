require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const { name, version } = require('./package.json')
const { registerUser, authenticateUser, retrieveUser, createQuiz, startQuiz, enrollQuiz, retrieveQuiz, questionStarted, nextQuestion, retrieveQuestion, submitAnswer, enableQuestion, retrieveResults } = require('./logic')
const jwt = require('jsonwebtoken')
const { argv: [, , port], env: { SECRET, PORT = port || 8080, DB_URL } } = process
const tokenVerifier = require('./helpers/token-verifier')(SECRET)
const { errors: { NotFoundError, ConflictError, CredentialsError, ContentError } } = require('quizzard-util')
const { database } = require('quizzard-data')

const api = express()

const jsonBodyParser = bodyParser.json()


api.post('/users', jsonBodyParser, (req, res) => {
    const { body: { name, surname, email, username, password } } = req

    try {
        registerUser(name, surname, email, username, password)
            .then(() => res.status(201).end())
            .catch(error => {

                const { message } = error

                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })

    } catch ({ message }) {
        res.status(400).json({ message })
    }

})

api.post('/auth', jsonBodyParser, (req, res) => {
    const { body: { username, password } } = req

    try {
        authenticateUser(username, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, SECRET, { expiresIn: '3h' })

                res.json({ token })
            })
            .catch(error => {
                const { message } = error

                if (error instanceof CredentialsError)
                    return res.status(401).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })

    }
})

api.get('/users', tokenVerifier, (req, res) => {
    try {
        const { id } = req
        retrieveUser(id)
            .then(user => res.json({ user }))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })

    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

api.post('/create', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, body: { title, description, questions } } = req
        debugger
        createQuiz(id, title, description, questions)
            .then(id => res.status(201).json({ id }))
            .catch(error => {
                const { message } = error
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })

    }
})

api.post('/start-quiz', jsonBodyParser, tokenVerifier, (req, res) => {
    try {
        const { id, body: { quizId } } = req
        startQuiz(id, quizId)
            .then(pincode => res.status(201).json({ pincode }))
            .catch(error => {
                const { message } = error
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

api.post('/enroll-quiz', jsonBodyParser, (req, res) => {
    try {
        const { body: { quizId, nickname } } = req
        enrollQuiz(quizId, nickname)
            .then(playerId => res.status(201).json({ playerId }))
            .catch(error => {
                const { message } = error
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                return res.status(500).json({ message })
            })

    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

api.post('/play', jsonBodyParser, (req, res) => {
    try {
        const { body: { playerId, quizId } } = req
        retrieveQuiz(playerId, quizId)
            .then(quiz => {
                const { title, description } = quiz
                res.json({ title, description })
            })
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

api.post('/play/question-check', jsonBodyParser, (req, res) => {
    try {
        const { body: { playerId, quizId } } = req

        questionStarted(playerId, quizId)
            .then(launched => res.status(200).json({ launched }))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ContentError)
                    return res.status(409).json({ message })
                if (error instanceof ConflictError)
                    return res.status(403).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

api.post('/play/enable', jsonBodyParser, (req, res) => {
    try {
        const { body: { quizId } } = req

        enableQuestion(quizId)
            .then( () => res.end())
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ContentError)
                    return res.status(409).json({ message })
                if (error instanceof ConflictError)
                    return res.status(403).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})


api.post('/play/next', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, body: { quizId } } = req

        nextQuestion(id, quizId)
            .then(() => res.end())
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ContentError)
                    return res.status(409).json({ message })
                if (error instanceof ConflictError)
                    return res.status(403).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})


api.post('/play/question', jsonBodyParser, (req, res) => {
    try {
        const { body: { playerId, quizId } } = req

        retrieveQuestion(playerId, quizId)
            .then(question => res.status(200).json({ question }))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ContentError)
                    return res.status(409).json({ message })
                if (error instanceof ConflictError)
                    return res.status(403).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

api.post('/play/submit-answer', jsonBodyParser, (req, res) => {
    try {
        const { body: { playerId, quizId, answers } } = req

        submitAnswer(playerId, quizId, answers)
            .then(() => res.end())
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ContentError)
                    return res.status(409).json({ message })
                if (error instanceof ConflictError)
                    return res.status(403).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

api.get('/play/results', jsonBodyParser, (req, res) => {
    try {
        const { body: {playerId, quizId} } = req
        retrieveResults(playerId, quizId)
            .then(results => res.status(200).json(results))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ContentError)
                    return res.status(409).json({ message })
                if (error instanceof ConflictError)
                    return res.status(403).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

database
    .connect(DB_URL)
api.listen(PORT, () => console.log(`${name} ${version} up and running on port ${PORT}`))


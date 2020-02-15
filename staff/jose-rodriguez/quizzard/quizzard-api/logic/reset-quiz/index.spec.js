require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const resetQuiz = require('.')
const { random } = Math
const { errors: { ContentError } } = require('quizzard-util')
const { ObjectId, database, models: { User, Quiz } } = require('quizzard-data')


describe.only('logic - reset quiz', () => {
    before(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password, title, questions, quizId, description, status, playerId, answers

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`

        await Promise.all([User.deleteMany(), Quiz.deleteMany()])

        const user = await User.create({ name, surname, email, username, password })

        id = user.id

        title = `title-${random()}`

        description = `description-${random()}`

        status = 'started'

        currentQuestion_ = 1

        questions = [{
            "text": "question 1",
            "answers": [{
                "text": "answer 1",
                "valid": true
            },
            {
                "text": "answer 2",
                "valid": false
            },
            {
                "text": "answer 3",
                "valid": false
            },
            {
                "text": "answer 4",
                "valid": false
            }],
            "score": 100,
            "timing": 30,
            "responses": [
                {
                    "answers": [
                        ObjectId("5df0b4c10ca6544e7037ce80")
                    ],
                    "_id": ObjectId("5df2609da121099f923264b3"),
                    "player": ObjectId("5df26016a121099f9232645d")
                },
                {
                    "answers": [],
                    "_id": ObjectId("5df260b3a121099f923264b5"),
                    "player": ObjectId("5df26014a121099f92326459")
                }],
            "startTime": "2019-12-12T15:46:22.857Z",
            "status": "finished",
            "resultsCalculated": true
        },
        {
            "text": "question 2",
            "answers": [{
                "text": "answer 1",
                "valid": true
            },
            {
                "text": "answer 2",
                "valid": false
            },
            {
                "text": "answer 3",
                "valid": false
            },
            {
                "text": "answer 4",
                "valid": false
            }],
            "score": 100,
            "timing": 30,
            "responses": [
                {
                    "answers": [
                        ObjectId("5df0b4c10ca6544e7037ce80")
                    ],
                    "_id": ObjectId("5df2609da121099f923264b3"),
                    "player": ObjectId("5df26016a121099f9232645d")
                },
                {
                    "answers": [],
                    "_id": ObjectId("5df260b3a121099f923264b5"),
                    "player": ObjectId("5df26014a121099f92326459")
                }],
            "startTime": "2019-12-12T15:46:22.857Z",
            "status": "finished",
            "resultsCalculated": true
        }]

        players_ = [
            {
                "score": 1250,
                "_id": ObjectId("5ddf9120c8b3c82695ba4376"),
                "nickname": "jechto"
            },
            {
                "score": 3670,
                "_id": ObjectId("5ddf9144735f2326c4185e29"),
                "nickname": "jose"
            }
        ]

        const quiz = await Quiz.create({ owner: id, title, description, status, players: players_, currentQuestion: currentQuestion_, questions })

        quizId = quiz.id
        playerId = '5ddf9144735f2326c4185e29'

        

    })

    it('should succeed on correct new quiz and user', async () => {

        expect(quizId).to.exist
        expect(quizId).to.be.a('string')
        expect(quizId).to.have.length.greaterThan(0)

        const quiz = await Quiz.findById(quizId)

        expect(quiz).to.exist
        expect(quiz.owner.toString()).to.equal(id)

        expect(quiz.title).to.exist
        expect(quiz.title).to.equal(title)
        expect(quiz.title).to.be.a('string')

        expect(quiz.description).to.exist
        expect(quiz.description).to.equal(description)
        expect(quiz.description).to.be.a('string')

        expect(quiz.status).to.be.a('string')
        expect(quiz.status).to.be.equal('started')

        expect(quiz.currentQuestion).to.be.a('number')
        expect(quiz.currentQuestion).to.equal(1)

        expect(quiz.players).to.exist
        expect(quiz.players).to.be.instanceOf(Array)

        expect(quiz.questions).to.exist
        expect(quiz.questions).to.have.length.greaterThan(0)
        expect(quiz.questions).to.be.instanceOf(Array)

    })

    it('should succed setting the quiz to initial values', async () => {

        quiz = await resetQuiz(id, quizId)

        debugger

        for (let i = 0; i < quiz.questions.length; i++) {

            expect(quiz.questions[i].startTime).to.be.undefined
            expect(quiz.questions[i].status).to.be.equal('finished')
            expect(quiz.questions[i].resultsCalculated).to.be.false
            expect(quiz.questions[i].responses).to.be.undefined

        }

        expect(quiz.currentQuestion).to.be.equal(-1)
        expect(quiz.players).to.be.undefined


    })

    after(() => Promise.all([User.deleteMany(), Quiz.deleteMany()]).then(database.disconnect))
})
require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const questionStarted = require('.')
const { random } = Math
const { errors: { ConflictError, NotFoundError } } = require('quizzard-util')
const { database, ObjectId, models: { User, Quiz } } = require('quizzard-data')

describe('logic - question started', () => {
    before(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password, title, questions, quizId, description, status, players, playerId

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

        currentQuestion_ = 0

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
            "timing": 30
        }]

        players_= [
            {
                "score": 0,
                "_id": ObjectId("5ddf9120c8b3c82695ba4376"),
                "nickname": "jechto"
            },
            {
                "score": 0,
                "_id": ObjectId("5ddf9144735f2326c4185e29"),
                "nickname": "jose"
            }
        ]
        
        const quiz = await Quiz.create({ owner: id, title, description, status, currentQuestion: currentQuestion_, players: players_, questions })

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
        expect(quiz.currentQuestion).to.equal(0)

        expect(quiz.players).to.exist
        expect(quiz.players).to.be.instanceOf(Array)

        expect(quiz.questions).to.exist
        expect(quiz.questions).to.have.length.greaterThan(0)
        expect(quiz.questions).to.be.instanceOf(Array)

    })

    it('should succeed on correct response of question status', async () => {

        
        res = await questionStarted(quizId)

        expect(res).to.exist
        expect(res).to.be.a('boolean')

    })

    it('should fail on incorrect question request', async () => {
        debugger
        quiz = await Quiz.findById(quizId)
        quiz.currentQuestion = 3

        await quiz.save()

        try {
            await questionStarted(quizId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ConflictError)

            const { message } = error
            expect(message).to.equal(`Question not found, please contact to the administrator`)
        }
    })

    it('should fail on non-existing quiz request', async () => {
        quizId = '5de0fea2bfdcadf08120aaf6'

        try {
            await questionStarted(quizId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)

            const { message } = error
            expect(message).to.equal(`quiz not found`)
        }
    })




    after(() => Promise.all([User.deleteMany(), Quiz.deleteMany()]).then(database.disconnect))
})
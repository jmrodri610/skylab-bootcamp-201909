require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const submitAnswer = require('.')
const { random } = Math
const {errors: {NotFoundError, ContentError}} = require('quizzard-util')
const { ObjectId, database, models: { User, Quiz } } = require('quizzard-data')

describe('logic - submit Answer', () => {
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

        

        const quiz = await Quiz.create({ owner: id, title, description, status, currentQuestion: currentQuestion_, questions })

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

    it('should succeed on correct submit answer', async () => {

        let quiz = await Quiz.findById(quizId)

        const answers = ["5ddf8df7c1225022cd84b748", "5ddf8df7c1225022cd84b747"] 
        debugger
        quiz = await submitAnswer(playerId, quizId, answers)

        const {currentQuestion, questions} = quiz
        
        expect(questions[currentQuestion].responses).to.exist
        expect(questions[currentQuestion].responses).to.be.instanceOf(Array)
        expect(questions[currentQuestion].responses).to.have.length.greaterThan(0)

    })




    it('should fail on non-existing quiz request', async () => {
        quizId = '5de0fea2bfdcadf08120aaf6'

        try {
            await submitAnswer(playerId, quizId, answers)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)

            const { message } = error
            expect(message).to.equal('quiz not found')
        }
    })

    it('should fail on incorrect player id format', async () => {
        playerId = 'playerId'

        try {
            await submitAnswer(playerId, quizId, answers)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ContentError)

            const { message } = error
            expect(message).to.equal('playerId is not a valid id')
        }
    })

    it('should fail on incorrect quiz id format', async () => {
        quizId = 'quizId'

        try {
            await submitAnswer(playerId, quizId, answers)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ContentError)

            const { message } = error
            expect(message).to.equal('quizId is not a valid id')
        }
    })

    it('should fail on incorrect answer id format', async () => {
        answers = ['answer1', 'answer2', 'answer3', 'answer4']

        try {
            await submitAnswer(playerId, quizId, answers)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ContentError)

            const { message } = error
            expect(message).to.equal('invalid id')
        }
    })

after(() => Promise.all([User.deleteMany(), Quiz.deleteMany()]).then(database.disconnect))
})
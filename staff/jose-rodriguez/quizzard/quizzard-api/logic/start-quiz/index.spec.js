require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const startQuiz = require('.')
const { random } = Math
const {errors: {NotFoundError, ConflictError, ContentError}} = require('quizzard-util')
const { database, models: { User, Quiz } } = require('quizzard-data')

describe('logic - start quiz', () => {
    before(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password, title, questions, quizId

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

        const quiz = await Quiz.create({owner: id, title, description, questions})


        quizId = quiz.id

    })

    it('should succeed on correct change quiz status', async () => {
        
        quizId = await startQuiz(id, quizId)

        expect(quizId).to.exist


        const quiz = await Quiz.findById(quizId)

        expect(quiz).to.exist
        expect(quiz.owner.toString()).to.equal(id)

        expect(quiz.title).to.exist
        expect(quiz.title).to.equal(title)
        expect(quiz.title).to.be.a('string')

        expect(quiz.description).to.exist
        expect(quiz.description).to.equal(description)
        expect(quiz.description).to.be.a('string')
        debugger
        expect(quiz.status).to.exist
        expect(quiz.status).to.equal('started')

        expect(quiz.currentQuestion).to.equal(0)

        expect(quiz.players).to.exist
        expect(quiz.players).to.be.instanceOf(Array)

        expect(quiz.questions).to.exist
        expect(quiz.questions).to.have.length.greaterThan(0)
        expect(quiz.questions).to.be.instanceOf(Array)

    })

    it('should fail on incorrect owner and quiz data', async () => {
        id = '5de0fea2bfdcadf08120aaf6'

        try {
            await startQuiz(id, quizId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ConflictError)

            const { message } = error
            expect(message).to.equal(`only the owner of this quiz can do this action`)
        }
    })

    it('should fail on non-existing quiz request', async () => {
        quizId = '5de0fea2bfdcadf08120aaf6'

        try {
            await startQuiz(id, quizId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)

            const { message } = error
            expect(message).to.equal('quiz not found')
        }
    })

    it('should fail on incorrect user id format', async () => {
        id = 'userId'

        try {
            await startQuiz(id, quizId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ContentError)

            const { message } = error
            expect(message).to.equal('userId is not a valid id')
        }
    })

    it('should fail on incorrect quiz id format', async () => {
        quizId = 'quizId'

        try {
            await startQuiz(id, quizId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ContentError)

            const { message } = error
            expect(message).to.equal('quizId is not a valid id')
        }
    })



    after(() => Promise.all([User.deleteMany(), Quiz.deleteMany()]).then(database.disconnect))
})
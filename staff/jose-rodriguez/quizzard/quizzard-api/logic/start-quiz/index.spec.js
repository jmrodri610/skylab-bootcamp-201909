require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const startQuiz = require('.')
const { random } = Math
const { database, models: { User, Quiz } } = require('quizzard-data')

describe.only('logic - create quiz', () => {
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

        debugger

        quizId = quiz.id

    })

    it('should succeed on correct change quiz status', async () => {
        
        quizId = await startQuiz(id, quizId)

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
        debugger
        expect(quiz.status).to.exist
        expect(quiz.status).to.equal('started')

        expect(quiz.currentQuestion).to.be.undefined

        expect(quiz.players).to.exist
        expect(quiz.players).to.be.instanceOf(Array)

        expect(quiz.questions).to.exist
        expect(quiz.questions).to.have.length.greaterThan(0)
        expect(quiz.questions).to.be.instanceOf(Array)

    })



    after(() => Promise.all([User.deleteMany(), Quiz.deleteMany()]).then(database.disconnect))
})
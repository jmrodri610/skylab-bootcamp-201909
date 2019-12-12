require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const createQuiz = require('.')
const { random } = Math
const { errors: { ContentError } } = require('quizzard-util')
const { database, models: { User, Quiz } } = require('quizzard-data')

describe('logic - create quiz', () => {
    before(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password, title, questions

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
                text: "answer 1",
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

    })

    it('should succeed on correct user and quiz data', async () => {
        
        const quizId = await createQuiz(id, title, description, questions)

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
        expect(quiz.status).to.be.undefined

        expect(quiz.currentQuestion).to.equal(-1)

        expect(quiz.players).to.exist
        expect(quiz.players).to.be.instanceOf(Array)

        expect(quiz.questions).to.exist
        expect(quiz.questions).to.have.length.greaterThan(0)
        expect(quiz.questions).to.be.instanceOf(Array)

    })

    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {
        expect(() => createQuiz(1)).to.throw(TypeError, '1 is not a string')
        expect(() => createQuiz(true)).to.throw(TypeError, 'true is not a string')
        expect(() => createQuiz([])).to.throw(TypeError, ' is not a string')
        expect(() => createQuiz({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createQuiz(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createQuiz(null)).to.throw(TypeError, 'null is not a string')


        expect(() => createQuiz(id, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => createQuiz(id, true)).to.throw(TypeError, 'true is not a string')
        expect(() => createQuiz(id, [])).to.throw(TypeError, ' is not a string')
        expect(() => createQuiz(id, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createQuiz(id, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createQuiz(id, null)).to.throw(TypeError, 'null is not a string')

        expect(() => createQuiz(id, '')).to.throw(ContentError, 'title is empty or blank')
        expect(() => createQuiz(id, ' \t\r')).to.throw(ContentError, 'title is empty or blank')


        expect(() => createQuiz(id, title, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => createQuiz(id, title, true)).to.throw(TypeError, 'true is not a string')
        expect(() => createQuiz(id, title, [])).to.throw(TypeError, ' is not a string')
        expect(() => createQuiz(id, title, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createQuiz(id, title, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createQuiz(id, title, null)).to.throw(TypeError, 'null is not a string')

        expect(() => createQuiz(id, title, '')).to.throw(ContentError, 'description is empty or blank')
        expect(() => createQuiz(id, title, ' \t\r')).to.throw(ContentError, 'description is empty or blank')
    })



    after(() => Promise.all([User.deleteMany(), Quiz.deleteMany()]).then(database.disconnect))
})
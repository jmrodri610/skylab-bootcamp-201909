require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const modifyQuiz = require('.')
const { random } = Math
const { errors: { NotFoundError, ConflictError }, polyfills: { arrayRandom } } = require('quizzard-util')
const { database, ObjectId, models: { User, Quiz } } = require('quizzard-data')

arrayRandom()

describe('logic - modify quiz', () => {
    before(() => database.connect(DB_URL_TEST))


    let id, name, surname, email, username, password, titles, descriptions

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`

        await Promise.all([User.deleteMany(), Quiz.deleteMany()])

        const user = await User.create({ name, surname, email, username, password })

        id = user.id

        quizIds = []
        titles = []
        descriptions = []
        questions = []

        const insertions = []

        for (let i = 0; i < 3; i++) {
            const quiz = {
                owner : ObjectId(id),
                title :`title-${random()}`,
                description : `description-${random()}`,
                questions: [{
                    "text": "question 3",
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
                    "score": 500,
                    "timing": 30
                }]

            }

            const {owner, title, description, questions} = quiz

            insertions.push(Quiz.create({ owner, title, description, questions })
                .then(quiz => quizIds.push(quiz.id)))

            titles.push(title)
            descriptions.push(description)
        }

        for (let i = 0; i < 3; i++)
            insertions.push(Quiz.create({
                owner: ObjectId(),
                title: `title-${random()}`,
                description: `description-${random()}`,
                questions: [{
                    "text": "question 5",
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
                    "score": 600,
                    "timing": 60
                }]
            }))

        await Promise.all(insertions)
    })

    it('should succeed on correct user and quiz data', async () => {
        const quizId = quizIds.random()
        const newTitle = `new-title-${random()}`
        const newDescription = `new-description-${random()}`
        const newQuestion = [{
            "text": "question 10",
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
            "score": 300,
            "timing": 20
        }]

        const response = await modifyQuiz(id, quizId, newTitle, newDescription, newQuestion)

        expect(response).to.not.exist

        const quiz = await Quiz.findById(quizId)

        expect(quiz.owner.toString()).to.equal(id)

        expect(quiz.title).to.exist
        expect(quiz.title).to.be.a('string')
        expect(quiz.title).to.have.length.greaterThan(0)
        expect(quiz.title).to.equal(newTitle)

        expect(quiz.description).to.exist
        expect(quiz.description).to.be.a('string')
        expect(quiz.description).to.have.length.greaterThan(0)
        expect(quiz.description).to.equal(newDescription)

        expect(quiz.questions).to.exist
        expect(quiz.questions).to.be.instanceOf(Array)
        expect(quiz.questions).to.have.length.greaterThan(0)

        expect(quiz.description).to.exist
        expect(quiz.description).to.be.a('string')
        expect(quiz.description).to.have.length.greaterThan(0)
        expect(quiz.description).to.equal(newDescription)

        expect(quiz.questions[0].text).to.exist
        expect(quiz.questions[0].text).to.be.a('string')
        expect(quiz.questions[0].text).to.have.length.greaterThan(0)
        debugger
        expect(quiz.questions[0].text).to.equal(newQuestion[0].text)

        expect(quiz.questions[0].score).to.exist
        expect(quiz.questions[0].score).to.be.a('number')
        expect(quiz.questions[0].score).to.be.greaterThan(0)
        expect(quiz.questions[0].score).to.equal(newQuestion[0].score)

        expect(quiz.questions[0].timing).to.exist
        expect(quiz.questions[0].timing).to.be.a('number')
        expect(quiz.questions[0].timing).to.be.greaterThan(0)
        expect(quiz.questions[0].timing).to.equal(newQuestion[0].timing)


    })

    it('should succeed on correct user and new quiz data, except for title', async () => {
        const quizId = quizIds.random()
        const newDescription = `new-description-${random()}`
        const newQuestion = [{
            "text": "question 79",
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
            "score": 255,
            "timing": 23
        }]

        const { title } = await Quiz.findById(quizId)

        const response = await modifyQuiz(id, quizId, undefined, newDescription, newQuestion)

        expect(response).to.not.exist

        const quiz = await Quiz.findById(quizId)

        expect(quiz.owner.toString()).to.equal(id)

        expect(quiz.title).to.exist
        expect(quiz.title).to.be.a('string')
        expect(quiz.title).to.have.length.greaterThan(0)
        expect(quiz.title).to.equal(title)

        expect(quiz.description).to.exist
        expect(quiz.description).to.be.a('string')
        expect(quiz.description).to.have.length.greaterThan(0)
        expect(quiz.description).to.equal(newDescription)

        expect(quiz.questions[0].text).to.exist
        expect(quiz.questions[0].text).to.be.a('string')
        expect(quiz.questions[0].text).to.have.length.greaterThan(0)
        expect(quiz.questions[0].text).to.equal(newQuestion[0].text)

        expect(quiz.questions[0].score).to.exist
        expect(quiz.questions[0].score).to.be.a('number')
        expect(quiz.questions[0].score).to.be.greaterThan(0)
        expect(quiz.questions[0].score).to.equal(newQuestion[0].score)

        expect(quiz.questions[0].timing).to.exist
        expect(quiz.questions[0].timing).to.be.a('number')
        expect(quiz.questions[0].timing).to.be.greaterThan(0)
        expect(quiz.questions[0].timing).to.equal(newQuestion[0].timing)
    })

    it('should succeed on correct user and new quiz data, except for description', async () => {
        const quizId = quizIds.random()
        const newTitle = `new-title-${random()}`
        const newQuestion = [{
            "text": "question 23",
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
            "score": 5423,
            "timing": 34
        }]

        const { description } = await Quiz.findById(quizId)

        const response = await modifyQuiz(id, quizId, newTitle, undefined, newQuestion)

        expect(response).to.not.exist

        const quiz = await Quiz.findById(quizId)

        expect(quiz.owner.toString()).to.equal(id)

        expect(quiz.title).to.exist
        expect(quiz.title).to.be.a('string')
        expect(quiz.title).to.have.length.greaterThan(0)
        expect(quiz.title).to.equal(newTitle)

        expect(quiz.description).to.exist
        expect(quiz.description).to.be.a('string')
        expect(quiz.description).to.have.length.greaterThan(0)
        expect(quiz.description).to.equal(description)

        expect(quiz.questions[0].text).to.exist
        expect(quiz.questions[0].text).to.be.a('string')
        expect(quiz.questions[0].text).to.have.length.greaterThan(0)
        expect(quiz.questions[0].text).to.equal(newQuestion[0].text)

        expect(quiz.questions[0].score).to.exist
        expect(quiz.questions[0].score).to.be.a('number')
        expect(quiz.questions[0].score).to.be.greaterThan(0)
        expect(quiz.questions[0].score).to.equal(newQuestion[0].score)

        expect(quiz.questions[0].timing).to.exist
        expect(quiz.questions[0].timing).to.be.a('number')
        expect(quiz.questions[0].timing).to.be.greaterThan(0)
        expect(quiz.questions[0].timing).to.equal(newQuestion[0].timing)
    })



    it('should fail on unexisting user and correct quiz data', async () => {
        const id = ObjectId().toString()
        const quizId = quizIds.random()
        const newTitle = `new-title-${random()}`
        const newDescription = `new-description-${random()}`
        const newQuestion = [{
            "text": "question 23",
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
            "score": 5423,
            "timing": 34
        }]

        try {
            await modifyQuiz(id, quizId, newTitle, newDescription, newQuestion)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })

    it('should fail on correct user and unexisting quiz data', async () => {
        const quizId = ObjectId().toString()
        const newTitle = `new-title-${random()}`
        const newDescription = `new-description-${random()}`
        const newQuestion = [{
            "text": "question 23",
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
            "score": 5423,
            "timing": 34
        }]

        try {
            await modifyQuiz(id, quizId, newTitle, newDescription, newQuestion)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user does not have quiz with id ${quizId}`)
        }
    })

    it('should fail on correct user and wrong quiz data', async () => {
        const { _id } = await Quiz.findOne({ _id: { $nin: quizIds.map(quizId => ObjectId(quizId)) } })

        const quizId = _id.toString()
        const newTitle = `new-title-${random()}`
        const newDescription = `new-description-${random()}`
        const newQuestion = [{
            "text": "question 23",
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
            "score": 5423,
            "timing": 34
        }]

        try {
            await modifyQuiz(id, quizId, newTitle, newDescription, newQuestion)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ConflictError)
            expect(error.message).to.equal(`user with id ${id} does not correspond to quiz with id ${quizId}`)
        }
    })



    after(() => Promise.all([User.deleteMany(), Quiz.deleteMany()]).then(database.disconnect))
})
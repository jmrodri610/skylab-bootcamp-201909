require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const listQuizs = require('.')
const { random } = Math
const { database, ObjectId, models: { User, Quiz } } = require('quizzard-data')

describe('logic - list quizs', () => {
    before(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password, quizIds, titles, questions

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
        questions = []

        const insertions = []

        for (let i = 0; i < 10; i++) {
            const quiz = {
                user: id,
                title: `title-${random()}`,
                questions: questions = [{
                    description: `question-${random()}`,
                    answers: [{
                        "answer": `answer-${random()}`,
                        "status": true
                    },
                    {
                        "answer": `answer-${random()}`,
                        "status": false
                    },
                    {
                        "answer": `answer-${random()}`,
                        "status": false
                    },
                    {
                        "answer": `answer-${random()}`,
                        "status": false
                    }]
                }]
            }

            insertions.push(Quiz.create(quiz).then(quiz => quizIds.push(quiz.id)))

            titles.push(quiz.title)
            descriptions.push(quiz.description)
        }

        for (let i = 0; i < 10; i++)
            insertions.push(Quiz.create({
                user: ObjectId(),
                title: `title-${random()}`,
                description: `description-${random()}`,
                status: 'REVIEW',
                date: new Date
            }))

        await Promise.all(insertions)
    })

    it('should succeed on correct user and quiz data', async () => {
        const quizs = await listQuizs(id)

        expect(quizs).to.exist
        expect(quizs).to.have.lengthOf(10)

        quizs.forEach(quiz => {
            expect(quiz.id).to.exist
            expect(quiz.id).to.be.a('string')
            expect(quiz.id).to.have.length.greaterThan(0)
            expect(quiz.id).be.oneOf(quizIds)

            expect(quiz.user).to.equal(id)

            expect(quiz.title).to.exist
            expect(quiz.title).to.be.a('string')
            expect(quiz.title).to.have.length.greaterThan(0)
            expect(quiz.title).be.oneOf(titles)

            expect(quiz.description).to.exist
            expect(quiz.description).to.be.a('string')
            expect(quiz.description).to.have.length.greaterThan(0)
            expect(quiz.description).be.oneOf(descriptions)

            expect(quiz.date).to.exist
            expect(quiz.date).to.be.an.instanceOf(Date)

            expect(quiz.lastAccess).to.exist
            expect(quiz.lastAccess).to.be.an.instanceOf(Date)
        })
    })


    after(() => Promise.all([User.deleteMany(), Quiz.deleteMany()]).then(database.disconnect))
})
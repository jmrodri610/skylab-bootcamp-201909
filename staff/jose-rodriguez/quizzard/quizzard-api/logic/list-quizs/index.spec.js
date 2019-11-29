require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const listQuizs = require('.')
const { random } = Math
const { database, ObjectId, models: { User, Quiz } } = require('quizzard-data')

describe('logic - list quizs', () => {
    before(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password, quizIds, titles, description, questions

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
        debugger
        const quizs = await listQuizs(id)

        expect(quizs).to.exist
        expect(quizs).to.have.lengthOf(3)

        quizs.forEach(quiz => {
            expect(quiz.id).to.exist
            expect(quiz.id).to.be.a('string')
            expect(quiz.id).to.have.length.greaterThan(0)
            expect(quiz.id).be.oneOf(quizIds)

            expect(quiz.owner).to.equal(id)

            expect(quiz.title).to.exist
            expect(quiz.title).to.be.a('string')
            expect(quiz.title).to.have.length.greaterThan(0)
            expect(quiz.title).be.oneOf(titles)

            expect(quiz.description).to.exist
            expect(quiz.description).to.be.a('string')
            expect(quiz.description).to.have.length.greaterThan(0)
            expect(quiz.description).be.oneOf(descriptions)


            expect(quiz.questions).to.exist
            expect(quiz.questions).to.be.instanceOf(Array)
            expect(quiz.questions).to.have.length.greaterThan(0)
    
    
            expect(quiz.questions[0].text).to.exist
            expect(quiz.questions[0].text).to.be.a('string')
            expect(quiz.questions[0].text).to.have.length.greaterThan(0)
            
    
            expect(quiz.questions[0].score).to.exist
            expect(quiz.questions[0].score).to.be.a('number')
            expect(quiz.questions[0].score).to.be.greaterThan(0)

    
            expect(quiz.questions[0].timing).to.exist
            expect(quiz.questions[0].timing).to.be.a('number')
            expect(quiz.questions[0].timing).to.be.greaterThan(0)

        })
    })


    after(() => Promise.all([User.deleteMany(), Quiz.deleteMany()]).then(database.disconnect))
})
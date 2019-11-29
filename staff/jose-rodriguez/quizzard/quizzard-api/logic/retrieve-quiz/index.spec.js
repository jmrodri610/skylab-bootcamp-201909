require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const retrieveQuiz = require('.')
const { random } = Math
const { database, models: { User, Quiz, Player } } = require('quizzard-data')

describe('logic - retrieve quiz', () => {
    before(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password, title, questions, quizId, nickname, playerId

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

        const quiz = await Quiz.create({ owner: id, title, description, questions })

        quizId = quiz.id

        nickname = `nickname-${random()}`

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

        expect(quiz.status).to.be.undefined

        expect(quiz.currentQuestion).to.be.undefined

        expect(quiz.players).to.exist
        expect(quiz.players).to.be.instanceOf(Array)

        expect(quiz.questions).to.exist
        expect(quiz.questions).to.have.length.greaterThan(0)
        expect(quiz.questions).to.be.instanceOf(Array)

    })

    it('should succeed on correct enrollment of a player in a started quiz', async () => {

        let quiz = await Quiz.findById(quizId)

        quiz.status = 'started'

        await quiz.save()

        const { players } = quiz
        const player = new Player({nickname})
        players.push(player)

        await quiz.save()
        
        playerId = player.id

        expect(playerId).to.exist
        expect(playerId).to.be.a('string')
        expect(playerId).to.have.length.greaterThan(0)

        expect(quiz.status).to.exist
        expect(quiz.status).to.equal('started')

        quiz = await Quiz.findById(quizId)
        
        expect(quiz.players).to.exist
        expect(quiz.players).to.be.instanceOf(Array)
        expect(quiz.players).to.have.length.greaterThan(0)
        expect(quiz.players[0].nickname).to.equal(nickname)


    })

    it('should succeed on correct retrieve quiz data for a player', async () => {

        quiz = await Quiz.findById(quizId)
        quiz.status = 'started'
        const { players } = quiz
        const player = new Player({nickname})
        players.push(player)

        await quiz.save()
        
        playerId = player.id
        

        quiz = await retrieveQuiz(playerId, quizId)

        expect(quiz.title).to.exist
        expect(quiz.title).to.be.a('string')
        expect(quiz.title).to.have.length.greaterThan(0)

        expect(quiz.status).to.exist
        expect(quiz.status).to.equal('started')
        
        expect(quiz.description).to.exist
        expect(quiz.description).to.be.a('string')
        expect(quiz.description).to.have.length.greaterThan(0)
        

    })

    it('should fail on incorrect player and quiz data', async () => {
        
        nickname = `nickname-${random()}`
        nickname2 = `nickname-${random()}`
        const quiz = await Quiz.findById(quizId)
        const { players } = quiz
        const player = new Player({nickname})
        players.push(player)
        playerId = player.id
        quiz.status = 'started'
        await quiz.save()

        const player2 = new Player({nickname2})
        playerId = player2.id

        try {
            await retrieveQuiz(playerId, quizId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist

            expect(error.message).to.exist
            expect(typeof error.message).to.equal('string')
            expect(error.message.length).to.be.greaterThan(0)
            expect(error.message).to.equal('player not found into this quiz. Contact to quizz administrator')
        }
    })

after(() => Promise.all([User.deleteMany(), Quiz.deleteMany()]).then(database.disconnect))
})
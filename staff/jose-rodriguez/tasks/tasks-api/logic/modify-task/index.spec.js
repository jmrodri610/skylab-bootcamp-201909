const { expect } = require('chai')
const users = require('../../data/users')('test')
const tasks = require('../../data/tasks')('test')
const createTask = require('.')
const { random } = Math
const uuid = require('uuid')


describe('logic - modify task', () => {
    before(() => Promise.all([users.load(), tasks.load()]))

    let id, name, surname, email, username, password, title, description

    beforeEach(() => {
        id = uuid()
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`

        users.data.push({ id, name, surname, email, username, password })

        title = `title-${random()}`
        description = `description-${random()}`
    })

    it('should succeed on correct credentials', () =>
        registerUser(name, surname, email, username, password)
            .then(response => {
                expect(response).to.be.undefined

                const user = users.find(user => user.username === username)

                expect(user).to.exist

                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.username).to.equal(username)
                expect(user.password).to.equal(password)
            })
    )


    describe('when user is created', () => {
        beforeEach(() => {
            const { user: {id: userId} } = users.data
            let 
            const task = {
                id: uuid(),
                user: userId,
                title,
                description,
                status: 'TODO',
                date: new Date
            }
            tasks.data.push(task)
        })

        it('should succeed on created task', () => {
            tasks.data.find(task => task.id === taskId)
        })


    })

})
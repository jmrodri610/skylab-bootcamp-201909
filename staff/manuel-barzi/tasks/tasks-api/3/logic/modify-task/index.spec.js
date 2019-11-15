const { expect } = require('chai')
const users = require('../../data/users')('test')
const tasks = require('../../data/tasks')('test')
const modifyTask = require('.')
const { random } = Math
const uuid = require('uuid')
require('../../utils/array-random')

describe.only('logic - modify task', () => {
    before(() => Promise.all([users.load(), tasks.load()]))

    const statuses = ['TODO', 'DOING', 'REVIEW', 'DONE']
    let id, name, surname, email, username, password, taskIds, titles, descriptions

    beforeEach(() => {
        id = uuid()
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`

        users.data.push({ id, name, surname, email, username, password })

        taskIds = []
        titles = []
        descriptions = []

        for (let i = 0; i < 10; i++) {
            const task = {
                id: uuid(),
                user: id,
                title: `title-${random()}`,
                description: `description-${random()}`,
                status: statuses.random(),
                date: new Date
            }

            tasks.data.push(task)

            taskIds.push(task.id)
            titles.push(task.title)
            descriptions.push(task.description)
        }

        for (let i = 0; i < 10; i++)
            tasks.data.push({
                id: uuid(),
                user: uuid(),
                title: `title-${random()}`,
                description: `description-${random()}`,
                status: statuses.random(),
                date: new Date
            })
    })

    it('should succeed on correct user and task data', () => {
        const taskId = taskIds.random()
        const newTitle = `new-title-${random()}`
        const newDescription = `new-description-${random()}`
        const newStatus = statuses.random()

        return modifyTask(id, taskId, newTitle, newDescription, newStatus)
            .then(response => {
                expect(response).to.not.exist

                const task = tasks.data.find(({id}) => id === taskId)

                expect(task.user).to.equal(id)

                expect(task.title).to.exist
                expect(task.title).to.be.a('string')
                expect(task.title).to.have.length.greaterThan(0)
                expect(task.title).to.equal(newTitle)

                expect(task.description).to.exist
                expect(task.description).to.be.a('string')
                expect(task.description).to.have.length.greaterThan(0)
                expect(task.description).to.equal(newDescription)

                expect(task.date).to.exist
                expect(task.date).to.be.an.instanceOf(Date)

                expect(task.lastAccess).to.exist
                expect(task.lastAccess).to.be.an.instanceOf(Date)
            })
    })

    // TODO other test cases
})
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const modifyTask = require('.')
const { random } = Math
const { errors: { NotFoundError, ConflictError, ContentError }, polyfills: { arrayRandom } } = require('tasks-util')
const { database, ObjectId, models: { User, Task } } = require('tasks-data')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

arrayRandom()

describe('logic - modify task', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    const statuses = ['TODO', 'DOING', 'REVIEW', 'DONE']
    let id, token, name, surname, email, username, password, taskIds, titles, descriptions

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`

        await Promise.all([User.deleteMany(), Task.deleteMany()])

        const user = await User.create({ name, surname, email, username, password })

        id = user.id
        token = jwt.sign({ sub: id }, TEST_SECRET)

        taskIds = []
        titles = []
        descriptions = []

        const insertions = []

        for (let i = 0; i < 10; i++) {
            const task = {
                user: ObjectId(id),
                title: `title-${random()}`,
                description: `description-${random()}`,
                status: 'REVIEW',
                date: new Date
            }

            insertions.push(Task.create(task)
                .then(task => taskIds.push(task.id)))

            titles.push(task.title)
            descriptions.push(task.description)
        }

        for (let i = 0; i < 10; i++)
            insertions.push(Task.create({
                user: ObjectId(),
                title: `title-${random()}`,
                description: `description-${random()}`,
                status: 'REVIEW',
                date: new Date
            }))

        await Promise.all(insertions)
    })

    it('should succeed on correct user and task data', async () => {
        const taskId = taskIds.random()
        const newTitle = `new-title-${random()}`
        const newDescription = `new-description-${random()}`
        const newStatus = statuses.random()

        const response = await modifyTask(token, taskId, newTitle, newDescription, newStatus)

        expect(response).toBeUndefined()

        const task = await Task.findById(taskId)

        expect(task.user.toString()).toBe(id)

        expect(task.title).toBeDefined()
        expect(task.title).toBeOfType('string')
        expect(task.title).toHaveLengthGreaterThan(0)
        expect(task.title).toBe(newTitle)

        expect(task.description).toBeDefined()
        expect(task.description).toBeOfType('string')
        expect(task.description).toHaveLengthGreaterThan(0)
        expect(task.description).toBe(newDescription)

        expect(task.status).toBeDefined()
        expect(task.status).toBeOfType('string')
        expect(task.status).toHaveLengthGreaterThan(0)
        expect(task.status).toBe(newStatus)

        expect(task.date).toBeDefined()
        expect(task.date).toBeInstanceOf(Date)

        expect(task.lastAccess).toBeDefined()
        expect(task.lastAccess).toBeInstanceOf(Date)
    })

    it('should succeed on correct user and new task data, except for title', async () => {
        const taskId = taskIds.random()
        const newDescription = `new-description-${random()}`
        const newStatus = statuses.random()

        const { title } = await Task.findById(taskId)

        const response = await modifyTask(token, taskId, undefined, newDescription, newStatus)

        expect(response).toBeUndefined()

        const task = await Task.findById(taskId)

        expect(task.user.toString()).toBe(id)

        expect(task.title).toBeDefined()
        expect(task.title).toBeOfType('string')
        expect(task.title).toHaveLengthGreaterThan(0)
        expect(task.title).toBe(title)

        expect(task.description).toBeDefined()
        expect(task.description).toBeOfType('string')
        expect(task.description).toHaveLengthGreaterThan(0)
        expect(task.description).toBe(newDescription)

        expect(task.status).toBeDefined()
        expect(task.status).toBeOfType('string')
        expect(task.status).toHaveLengthGreaterThan(0)
        expect(task.status).toBe(newStatus)

        expect(task.date).toBeDefined()
        expect(task.date).toBeInstanceOf(Date)

        expect(task.lastAccess).toBeDefined()
        expect(task.lastAccess).toBeInstanceOf(Date)
    })

    it('should succeed on correct user and new task data, except for description', async () => {
        const taskId = taskIds.random()
        const newTitle = `new-title-${random()}`
        const newStatus = statuses.random()

        const { description } = await Task.findById(taskId)

        const response = await modifyTask(token, taskId, newTitle, undefined, newStatus)

        expect(response).toBeUndefined()

        const task = await Task.findById(taskId)

        expect(task.user.toString()).toBe(id)

        expect(task.title).toBeDefined()
        expect(task.title).toBeOfType('string')
        expect(task.title).toHaveLengthGreaterThan(0)
        expect(task.title).toBe(newTitle)

        expect(task.description).toBeDefined()
        expect(task.description).toBeOfType('string')
        expect(task.description).toHaveLengthGreaterThan(0)
        expect(task.description).toBe(description)

        expect(task.status).toBeDefined()
        expect(task.status).toBeOfType('string')
        expect(task.status).toHaveLengthGreaterThan(0)
        expect(task.status).toBe(newStatus)

        expect(task.date).toBeDefined()
        expect(task.date).toBeInstanceOf(Date)

        expect(task.lastAccess).toBeDefined()
        expect(task.lastAccess).toBeInstanceOf(Date)
    })

    it('should succeed on correct user and new task data, except for status', async () => {
        const taskId = taskIds.random()
        const newTitle = `new-title-${random()}`
        const newDescription = `new-description-${random()}`

        const { status } = await Task.findById(taskId)

        const response = await modifyTask(token, taskId, newTitle, newDescription, undefined)

        expect(response).toBeUndefined()

        const task = await Task.findById(taskId)

        expect(task.user.toString()).toBe(id)

        expect(task.title).toBeDefined()
        expect(task.title).toBeOfType('string')
        expect(task.title).toHaveLengthGreaterThan(0)
        expect(task.title).toBe(newTitle)

        expect(task.description).toBeDefined()
        expect(task.description).toBeOfType('string')
        expect(task.description).toHaveLengthGreaterThan(0)
        expect(task.description).toBe(newDescription)

        expect(task.status).toBeDefined()
        expect(task.status).toBeOfType('string')
        expect(task.status).toHaveLengthGreaterThan(0)
        expect(task.status).toBe(status)

        expect(task.date).toBeDefined()
        expect(task.date).toBeInstanceOf(Date)

        expect(task.lastAccess).toBeDefined()
        expect(task.lastAccess).toBeInstanceOf(Date)
    })

    it('should fail on unexisting user and correct task data', async () => {
        const id = ObjectId().toString()
        const token = jwt.sign({ sub: id }, TEST_SECRET)
        const taskId = taskIds.random()
        const newTitle = `new-title-${random()}`
        const newDescription = `new-description-${random()}`
        const newStatus = statuses.random()

        try {
            await modifyTask(token, taskId, newTitle, newDescription, newStatus)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })

    it('should fail on correct user and unexisting task data', async () => {
        const taskId = ObjectId().toString()
        const newTitle = `new-title-${random()}`
        const newDescription = `new-description-${random()}`
        const newStatus = statuses.random()

        try {
            await modifyTask(token, taskId, newTitle, newDescription, newStatus)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user does not have task with id ${taskId}`)
        }
    })

    it('should fail on correct user and wrong task data', async () => {
        const { _id } = await Task.findOne({ _id: { $nin: taskIds.map(taskId => ObjectId(taskId)) } })

        const taskId = _id.toString()
        const newTitle = `new-title-${random()}`
        const newDescription = `new-description-${random()}`
        const newStatus = statuses.random()

        try {
            await modifyTask(token, taskId, newTitle, newDescription, newStatus)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(ConflictError)
            expect(error.message).toBe(`user with id ${id} does not correspond to task with id ${taskId}`)
        }
    })

    it('should fail on correct user and wrong task status', () => {
        const taskId = taskIds.random()
        const newTitle = `new-title-${random()}`
        const newDescription = `new-description-${random()}`
        const newStatus = 'wrong-status'

        expect(() => modifyTask(token, taskId, newTitle, newDescription, newStatus)).toThrow(ContentError, `${newStatus} does not match any of the valid status values: ${statuses}`)
    })

    // TODO other test cases

    afterAll(() => Promise.all([User.deleteMany(), Task.deleteMany()]).then(database.disconnect))
})

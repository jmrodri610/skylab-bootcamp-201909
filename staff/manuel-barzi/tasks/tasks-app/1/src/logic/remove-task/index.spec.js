const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const removeTask = require('.')
const { random } = Math
const { errors: { NotFoundError, ConflictError }, polyfills: { arrayRandom } } = require('tasks-util')
const { database, ObjectId, models: { User, Task } } = require('tasks-data')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

arrayRandom()

describe('logic - remove task', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

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
                user: id,
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

        const response = await removeTask(token, taskId)

        expect(response).toBeUndefined()

        const task = await Task.findById(taskId)

        expect(task).toBeNull()
    })

    it('should fail on unexisting user and correct task data', async () => {
        const id = ObjectId().toString()
        const token = jwt.sign({ sub: id }, TEST_SECRET)
        const taskId = taskIds.random()

        try {
            await removeTask(token, taskId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })

    it('should fail on correct user and unexisting task data', async () => {
        const taskId = ObjectId().toString()

        try {
            await removeTask(token, taskId)

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

        try {
            await removeTask(token, taskId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(ConflictError)
            expect(error.message).toBe(`user with id ${id} does not correspond to task with id ${taskId}`)
        }
    })

    // TODO other test cases

    afterAll(() => Promise.all([User.deleteMany(), Task.deleteMany()]).then(database.disconnect))
})

const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const listTasks = require('.')
const { random } = Math
const { database, ObjectId, models: { User, Task } } = require('tasks-data')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

describe('logic - list tasks', () => {
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

            insertions.push(Task.create(task).then(task => taskIds.push(task.id)))

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
        const tasks = await listTasks(token)

        expect(tasks).toBeDefined()
        expect(tasks).toHaveLength(10)

        tasks.forEach(task => {
            expect(task.id).toBeDefined()
            expect(task.id).toBeOfType('string')
            expect(task.id).toHaveLengthGreaterThan(0)
            expect(task.id).toBeOneOf(taskIds)

            expect(task.user).toBe(id)

            expect(task.title).toBeDefined()
            expect(task.title).toBeOfType('string')
            expect(task.title).toHaveLengthGreaterThan(0)
            expect(task.title).toBeOneOf(titles)

            expect(task.description).toBeDefined()
            expect(task.description).toBeOfType('string')
            expect(task.description).toHaveLengthGreaterThan(0)
            expect(task.description).toBeOneOf(descriptions)

            expect(task.date).toBeDefined()
            expect(task.date).toBeInstanceOf(Date)

            expect(task.lastAccess).toBeDefined()
            expect(task.lastAccess).toBeInstanceOf(Date)
        })
    })

    // TODO other test cases

    afterAll(() => Promise.all([User.deleteMany(), Task.deleteMany()]).then(database.disconnect))
})

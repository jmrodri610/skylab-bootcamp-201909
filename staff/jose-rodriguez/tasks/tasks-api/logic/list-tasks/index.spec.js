require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const listTasks = require('.')
const { random } = Math
const database = require('../../utils/database')
const { ObjectId } = database
// const uuid = require('uuid')

describe.only('logic - list tasks', () => {
    let client, users, tasks

    before(() => {
        client = database(DB_URL_TEST)

        return client.connect()
            .then(connection => {
                const db = connection.db()

                users = db.collection('users')
                tasks = db.collection('tasks')
            })
    })

    let id, name, surname, email, username, password, taskIds, titles, descriptions

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`

        return users.insertOne({ name, surname, email, username, password })
            .then(result => {
                id = result.insertedId.toString()


                taskIds = []
                titles = []
                descriptions = []

                for (let i = 0; i < 10; i++) {
                    const task = {
                        user: id,
                        title: `title-${random()}`,
                        description: `description-${random()}`,
                        status: 'REVIEW',
                        date: new Date
                    }

                    
                    return tasks.insertOne(task)
                    .then(result => {   
                        if (!result.insertedId) throw Error(error.message)

                        taskIds.push(task.id)
                        titles.push(task.title)
                        descriptions.push(task.description)
                        })
                }
                
            })

        // for (let i = 0; i < 10; i++)
        //     tasks.insertOne({
        //         user: uuid(),
        //         title: `title-${random()}`,
        //         description: `description-${random()}`,
        //         status: 'REVIEW',
        //         date: new Date
        //     })
    })

    it('should succeed on correct user and task data', () =>
        listTasks(id)
            .then(tasks => {
                expect(tasks).to.exist
                expect(tasks).to.have.lengthOf(10)

                tasks.forEach(task => {
                    expect(task.id).to.exist
                    expect(task.id).to.be.a('string')
                    expect(task.id).to.have.length.greaterThan(0)
                    expect(task.id).be.oneOf(taskIds)

                    expect(task.user).to.equal(id)

                    expect(task.title).to.exist
                    expect(task.title).to.be.a('string')
                    expect(task.title).to.have.length.greaterThan(0)
                    expect(task.title).be.oneOf(titles)

                    expect(task.description).to.exist
                    expect(task.description).to.be.a('string')
                    expect(task.description).to.have.length.greaterThan(0)
                    expect(task.description).be.oneOf(descriptions)

                    expect(task.lastAccess).to.exist
                    expect(task.lastAccess).to.be.an.instanceOf(Date)
                })
            })
    )

    // TODO other test cases

    after(() => client.close())
})
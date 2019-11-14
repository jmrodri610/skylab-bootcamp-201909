const { expect } = require('chai')
const createTask = require('.')
const { ContentError } = require('../../utils/errors')
const tasks = require('../../data/tasks')('test')


describe('logic - create task', () => {
    before( ()=> tasks.load())

    let id, user, title, description, status, date

    beforeEach(() => {
        id = `id-${Math.random()}`
        user = `user-${Math.random()}`
        title = `title-${Math.random()}`
        description = `desc-${Math.random()}`
        status = `status-${Math.random()}`
        date = `date-${new Date(now)}`
    })

    it('should succeed on correct credentials', () =>
        createTask(id, user, title, description, status, date)
            .then(response => {
                expect(response).to.be.undefined

                const task = tasks.find(task => task.title === title)

                expect(task).to.exist

                expect(task.id).to.equal(id)
                expect(task.user).to.equal(user)
                expect(task.title).to.equal(title)
                expect(task.description).to.equal(description)
                expect(task.status).to.equal(status)
                expect(task.date).to.equal(date)
            })
    )

    describe('when task already exists', () => {
        beforeEach(()=> {
            tasks.push ({ id, user, title, description, status, date })

        })

        it('should fail on already existing task', () =>
            createTask(id, user, title, description, status, date)
                .then(() => {
                    throw Error('should not reach this point')
                })
                .catch(error => {
                    expect(error).to.exist

                    expect(error.message).to.exist
                    expect(typeof error.message).to.equal('string')
                    expect(error.message.length).to.be.greaterThan(0)
                    expect(error.message).to.equal(`task with title "${title}" already exists`)
                })
        )
    })

    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {
        expect(() => createTask(1)).to.throw(TypeError, '1 is not a string')
        expect(() => createTask(true)).to.throw(TypeError, 'true is not a string')
        expect(() => createTask([])).to.throw(TypeError, ' is not a string')
        expect(() => createTask({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createTask(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createTask(null)).to.throw(TypeError, 'null is not a string')

        expect(() => createTask('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => createTask(' \t\r')).to.throw(ContentError, 'id is empty or blank')

        expect(() => createTask(id, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => createTask(id, true)).to.throw(TypeError, 'true is not a string')
        expect(() => createTask(id, [])).to.throw(TypeError, ' is not a string')
        expect(() => createTask(id, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createTask(id, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createTask(id, null)).to.throw(TypeError, 'null is not a string')

        expect(() => createTask(id, '')).to.throw(ContentError, 'user is empty or blank')
        expect(() => createTask(id, ' \t\r')).to.throw(ContentError, 'user is empty or blank')

        expect(() => createTask(id, user, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => createTask(id, user, true)).to.throw(TypeError, 'true is not a string')
        expect(() => createTask(id, user, [])).to.throw(TypeError, ' is not a string')
        expect(() => createTask(id, user, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createTask(id, user, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createTask(id, user, null)).to.throw(TypeError, 'null is not a string')

        expect(() => createTask(id, user, '')).to.throw(ContentError, 'title is empty or blank')
        expect(() => createTask(id, user, ' \t\r')).to.throw(ContentError, 'title is empty or blank')

        expect(() => createTask(id, user, title, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => createTask(id, user, title, true)).to.throw(TypeError, 'true is not a string')
        expect(() => createTask(id, user, title, [])).to.throw(TypeError, ' is not a string')
        expect(() => createTask(id, user, title, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createTask(id, user, title, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createTask(id, user, title, null)).to.throw(TypeError, 'null is not a string')

        expect(() => createTask(id, user, title, '')).to.throw(ContentError, 'description is empty or blank')
        expect(() => createTask(id, user, title, ' \t\r')).to.throw(ContentError, 'description is empty or blank')

        expect(() => createTask(id, user, title, description, '')).to.throw(ContentError, 'status is empty or blank')
        expect(() => createTask(id, user, title, description, ' \t\r')).to.throw(ContentError, 'status is empty or blank')

        expect(() => createTask(id, user, title, description, status, '')).to.throw(ContentError, 'date is empty or blank')
        expect(() => createTask(id, user, title, description, status,  ' \t\r')).to.throw(ContentError, 'date is empty or blank')
    })


})
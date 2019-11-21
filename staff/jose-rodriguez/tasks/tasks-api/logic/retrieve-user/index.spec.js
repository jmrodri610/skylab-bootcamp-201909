require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const retrieveUser = require('.')
const { random } = Math
const { NotFoundError } = require('../../utils/errors')
const { database, models: { User } } = require('../../data')

describe.only('logic - retrieve user', () => {
    before(() => database.connect(DB_URL_TEST))
    let id, name, surname, email, username, password

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`

        return (async () => {

            await User.deleteMany()

            const user = User.create({ id, name, surname, email, username, password })
            user => id = user.id
        })()

    })

    it('should succeed on correct user id', async () => {
        const user = await retrieveUser(id)

        expect(user).to.exist
        expect(user.id).to.equal(id)
        expect(user.name).to.equal(name)
        expect(user.surname).to.equal(surname)
        expect(user.email).to.equal(email)
        expect(user.username).to.equal(username)
        expect(user.password).to.be.undefined
    })

    it('should fail on wrong user id', async () => {
        const id = '41224d776a326fb40f000001'
        try {
            await retrieveUser(id)
            throw Error('should not reach this point')

        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user not found`)
        }
    })
after(() => User.deleteMany().then(database.disconnect))
})
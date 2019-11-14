const validate = require('../../utils/validate')
const users = require('../../data/users/')
const fs = require('fs')
const path = require('path')
const { ContentError } = require('../../utils/errors')


module.exports = function (name, surname, email, username, password) {
    validate.string(name)
    validate.string.notVoid('name', name)
    validate.string(surname)
    validate.string.notVoid('surname', surname)
    validate.string(email)
    validate.string.notVoid('e-mail', email)
    validate.string(username)
    validate.string.notVoid('username', username)
    validate.string(password)
    validate.string.notVoid('password', password)

    return new Promise((resolve, reject) => {

        let exist
        if (users.length > 0) exist = users.findIndex(user => user.username === username)
        if (exist > 0) return reject(new ContentError(`user with username "${username}" already exists`))

        users.push({ name, surname, email, username, password })

        fs.writeFile(path.join(__dirname, '../../data/users/index.json'), JSON.stringify(users), error => error ? reject(error) : resolve())
    })
}
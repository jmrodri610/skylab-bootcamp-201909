const validate = require('../../utils/validate')
const tasks = require('../../data/tasks')()
const uuid = require('uuid/v4')
const { ConflictError } = require('../../utils/errors')

module.exports = function (user, title, description, status) {
    validate.string(user)
    validate.string.notVoid('user', user)
    validate.string(title)
    validate.string.notVoid('title', title)
    validate.string(description)
    validate.string.notVoid('description', description)
    validate.string(status)
    validate.string.notVoid('status', status)


    return new Promise((resolve, reject) => {


        const id = uuid()

        const date = new Date(now)

        const newTask = {id, date, user, title, description, status}
        
        tasks.data.push(newTask)

        tasks.persist()
            .then(resolve(id))
            .catch(reject)
    })
}
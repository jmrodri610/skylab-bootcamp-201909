const validate = require('../../utils/validate')
const tasks = require('../../data/tasks')
const { NotFoundError } = require('../../utils/errors')

module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)

    return new Promise((resolve, reject) => {
        const index = tasks.indexOf('id')
        if (indexOf == -1) return reject(new NotFoundError(`task with id ${id} not found`))
        else {
            tasks.splice(index, 1)
        }

        tasks.persist().then(() => resolve(`Task with id ${id} removed successfully`).catch(reject))

    })
}
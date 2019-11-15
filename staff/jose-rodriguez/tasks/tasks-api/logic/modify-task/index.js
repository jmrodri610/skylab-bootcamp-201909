const validate = require('../../utils/validate')
const tasks = require('../../data/tasks')
const { NotFoundError } = require('../../utils/errors')

module.exports = function (id, title, description, status) {
    validate.string(id)
    validate.string.notVoid('id', id)

    return new Promise((resolve, reject) => {
        const task = tasks.find(task => task.id === id)

        if (!task) return reject(new NotFoundError(`task with id ${id} not found`))

        const { user: userId, date: date } = task

        const task = {
            id: id,
            user: userId,
            title,
            description,
            status,
            date: date
        }

        tasks.data.push(task)

        tasks.persist().then(() => resolve(task.id)).catch(reject)
    })
}
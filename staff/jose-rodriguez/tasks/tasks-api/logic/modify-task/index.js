const validate = require('../../utils/validate')
const { NotFoundError, ConflictError } = require('../../utils/errors')
const database = require('../../utils/database')
const { ObjectId } = database

module.exports = function (id, taskId, title, description, status) {
    validate.string(id)
    validate.string.notVoid('id', id)
    validate.string(taskId)
    validate.string.notVoid('task id', taskId)
    if (title) {
        validate.string(title)
        validate.string.notVoid('title', title)
    }
    if (description) {
        validate.string(description)
        validate.string.notVoid('description', description)
    }
    if (status) {
        validate.string(status)
        validate.string.notVoid('status', status)
        validate.matches('status', status, 'TODO', 'DOING', 'REVIEW', 'DONE')
    }

    const client = database()

    return client.connect()
        .then(connection => {
            const db = connection.db()

            users = db.collection('users')
            tasks = db.collection('tasks')

            return users.findOne({ _id: ObjectId(id) })
                .then(user => {
                    if (!user) throw new NotFoundError('user not found')

                    return tasks.findOne({ _id: ObjectId(taskId) })
                        .then(task => {
                            const userId = task.user.toString()
                            if (!task) throw new NotFoundError('task not found')
                            if (userId !== id) throw new ConflictError('this task does not belong the current user')

                            const { _id } = task

                            title && tasks.updateOne({ _id }, { $set: { title: title } })
                            description && tasks.updateOne({ _id }, { $set: { description: description } })
                            status && tasks.updateOne({ _id }, { $set: { status: status } })

                            tasks.updateOne({ _id }, { $set: { lastAccess: new Date } })

                            return task
                        })
                })

        })
}
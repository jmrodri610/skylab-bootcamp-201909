const validate = require('../../utils/validate')
const { NotFoundError, ConflictError } = require('../../utils/errors')
const database = require('../../utils/database')
const { ObjectId } = database

module.exports = function (id, taskId) {
    validate.string(id)
    validate.string.notVoid('id', id)

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

                            return tasks.remove({ _id: ObjectId(taskId) })
                        })
                })
        })
}
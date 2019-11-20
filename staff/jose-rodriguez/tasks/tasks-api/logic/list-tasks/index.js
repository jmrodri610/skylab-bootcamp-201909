const validate = require('../../utils/validate')
const { NotFoundError } = require('../../utils/errors')
const {ObjectId, models: {User, Task}} = require('../../data')


module.exports = function (id) {
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

                    return tasks.find({ user: ObjectId(id) }).toArray()
                })
        })
}
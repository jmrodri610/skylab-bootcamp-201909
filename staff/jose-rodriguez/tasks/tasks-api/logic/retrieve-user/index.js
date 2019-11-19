const validate = require('../../utils/validate')
const { NotFoundError } = require('../../utils/errors')
const { ObjectId, models: { User } } = require('../../data')


module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)


    return User.findById(id)
        .then(user => {
            if (!user) throw new NotFoundError(`user not found`)

            user.lastAccess = new Date

            return user.save()
        })
        .then( user => {
            user = user.toObject()

            user.id = user._id.toString()
            delete user._id

            delete user.password

            return user
        })
}
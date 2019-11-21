const validate = require('../../utils/validate')
const { NotFoundError } = require('../../utils/errors')
const { models: { User } } = require('../../data')


module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)


    return (async () => {

        let user = await User.findById(id)
        if (!user) throw new NotFoundError(`user not found`)

        user.lastAccess = new Date

        user = await user.save()

        user = user.toObject()
        user.id = user._id.toString()
        delete user._id

        delete user.password

        return user
    })()
}
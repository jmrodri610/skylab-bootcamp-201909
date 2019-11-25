const { validate, errors: { NotFoundError } } = require('quizzard-util')
const { ObjectId, models: { User, Quiz }} = require('quizzard-data')

module.exports = function (id, title) {
    
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(title)
    validate.string.notVoid('title', title)

    debugger
    const players = []
    const pincode = Math.floor(Math.random()*100000000)
    const rungame = Boolean(false)
    const questions = []

    return (async () => {
        const user = await User.findById(id)

        if(!user) throw new NotFoundError('user not found')

        const quiz = await Quiz.create({user: id, title, players, pincode, rungame, questions})

        return quiz.id
    })()
}
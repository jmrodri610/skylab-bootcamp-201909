const { validate, errors: { NotFoundError } } = require('quizzard-util')
const { ObjectId, models: { User, Quiz, Game }} = require('quizzard-data')

module.exports = function (id, quizId) {
    
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(quizId)
    validate.string.notVoid('quizId', quizId)


    return (async () => {
        const user = await User.findById(id)

        if(!user) throw new NotFoundError('user not found')

        const quiz = await Quiz.findById(quizId)

        if(!quiz) throw new NotFoundError('user not found')

        const game = await Game.create({})

        return game.pincode
    })()
}
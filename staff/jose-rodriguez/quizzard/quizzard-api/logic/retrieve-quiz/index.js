const { validate, errors: { NotFoundError } } = require('quizzard-util')
const { ObjectId, models: { Quiz }} = require('quizzard-data')

module.exports = function (playerId, quizId) {
    
    validate.string(quizId)
    validate.string.notVoid('quizId', quizId)
    if (!ObjectId.isValid(quizId)) throw new ContentError(`${quizId} is not a valid id`)

    validate.string(playerId)
    validate.string.notVoid('playerId', playerId)
    if (!ObjectId.isValid(playerId)) throw new ContentError(`${playerId} is not a valid id`)


    return (async () => {
        let quiz = await User.findById(quizId)

        if(!quiz) throw new NotFoundError('quiz not found')

        let player = await Quiz.findById(playerId)

        const { title, description } = quiz

        return {title, description}
    })()
}
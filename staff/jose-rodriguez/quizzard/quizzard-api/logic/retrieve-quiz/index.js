const { validate, errors: { NotFoundError, ContentError } } = require('quizzard-util')
const { ObjectId, models: { Quiz } } = require('quizzard-data')

module.exports = function (playerId, quizId) {

    validate.string(quizId)
    validate.string.notVoid('quizId', quizId)
    if (!ObjectId.isValid(quizId)) throw new ContentError(`${quizId} is not a valid id`)

    validate.string(playerId)
    validate.string.notVoid('playerId', playerId)
    if (!ObjectId.isValid(playerId)) throw new ContentError(`${playerId} is not a valid id`)


    return (async () => {

        let quiz = await Quiz.findById(quizId).lean()

        if (!quiz) throw new NotFoundError('quiz not found')

        const { players } = quiz

        debugger
        for (i = 0; i < players.length; i++) {

            if (players[i]._id.toString() === playerId) {
                return quiz

            }   
        } 
        throw new NotFoundError('player not found into this quiz. Contact to quizz administrator')
    
            

    })()
}
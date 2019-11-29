const { validate, errors: { NotFoundError, ContentError, ConflictError } } = require('quizzard-util')
const { ObjectId, models: { Quiz } } = require('quizzard-data')

module.exports = function (playerId, quizId) {


    validate.string(playerId)
    validate.string.notVoid('playerId', playerId)
    if (!ObjectId.isValid(playerId)) throw new ContentError(`${playerId} is not a valid id`)

    validate.string(quizId)
    validate.string.notVoid('quizId', quizId)
    if (!ObjectId.isValid(quizId)) throw new ContentError(`${quizId} is not a valid id`)



    return (async () => {
        const quiz = await Quiz.findById(quizId)

        if (!quiz) throw new NotFoundError('quiz not found')

        const { players } = quiz
        debugger
        for (i = 0; i < players.length; i++) {


            if (players[i]._id.toString() === playerId) {
                const {currentQuestion, questions} = quiz
                debugger
                if( currentQuestion >= questions.length) throw new ConflictError('Question not found, please contact to the administrator')
                if (questions[currentQuestion].status === 'started') {
                    return true  
                } else {
                    return false
                }
            }    

        } throw new NotFoundError('player not found into this quiz. Contact to quizz administrator')
    })()
}
    
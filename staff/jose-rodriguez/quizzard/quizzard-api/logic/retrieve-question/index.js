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

        let quiz = await Quiz.findById(quizId).lean()

        if (!quiz) throw new NotFoundError('quiz not found')

        const { players } = quiz

        
        for (i = 0; i < players.length; i++) {

            if (players[i]._id.toString() === playerId) {
                const {currentQuestion, questions} = quiz
                if( currentQuestion >= questions.length) throw new ConflictError('Question not found, please contact to the administrator')
                question = questions[currentQuestion]

                const {text: text_, answers: answers_, score: score_, timing: timing_} = question
                let answer = answers_.map(answer => { return answer.text })
                
                const retrieveQuestion = {text_, answer, score_, timing_}
                    
                return retrieveQuestion
                
            }   
        } 
        throw new NotFoundError('player not found into this quiz. Contact to quizz administrator')
    
    })()
}
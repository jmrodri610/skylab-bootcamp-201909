const { validate, errors: { NotFoundError, ContentError, ConflictError } } = require('quizzard-util')
const { ObjectId, models: { Quiz } } = require('quizzard-data')

module.exports = function (quizId) {


    // validate.string(playerId)
    // validate.string.notVoid('playerId', playerId)
    // if (!ObjectId.isValid(playerId)) throw new ContentError(`${playerId} is not a valid id`)

    validate.string(quizId)
    validate.string.notVoid('quizId', quizId)
    if (!ObjectId.isValid(quizId)) throw new ContentError(`${quizId} is not a valid id`)

    return (async () => {

        let quiz = await Quiz.findById(quizId)

        if (!quiz) throw new NotFoundError('quiz not found')

        const { questions, currentQuestion, players: players_ } = quiz

        const question = questions[currentQuestion]

        const { responses: playerResponses, answers: answers_, status, resultsCalculated } = question

        if (status !== 'finished') throw new ConflictError ('cannot calculate results if question is not finished')

        const corrects = []
        if (!resultsCalculated) {
            for (i = 0; i < playerResponses.length; i++) {
                for (j = 0; j < playerResponses[i].answers.length; j++) {
                    let isValid = false
                    answers_.forEach(({ valid, _id }) => {
                        if (playerResponses[i].answers[j]._id.toString() === _id.toString()) {
                            isValid = valid
                            debugger
                        }
                    })
    
                    if (isValid) {
                        corrects.push(playerResponses[i].player)
                        const player = players_.find(player => player.id === playerResponses[i].player.toString())
    
                        if (!player) throw new NotFoundError('player not found')
    
                        player.score = player.score + Math.floor(questions[currentQuestion].score / corrects.length)
    
                    }
    
                }
    
            }
            
            question.resultsCalculated = true
        }

        await quiz.save()

        const validAnswers = []

        answers_.forEach(validAnswer => {
            if (validAnswer.valid === true)
                validAnswers.push(validAnswer.text)
        })

        const results = { validAnswers, players_ }


        return results

    })()
}
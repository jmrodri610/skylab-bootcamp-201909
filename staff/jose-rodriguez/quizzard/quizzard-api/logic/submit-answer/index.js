const { validate, errors: { NotFoundError, ContentError } } = require('quizzard-util')
const { ObjectId, models: { Quiz, Response } } = require('quizzard-data')

module.exports = function (playerId, quizId, answers) {

    validate.string(playerId)
    validate.string.notVoid('playerId', playerId)
    if (!ObjectId.isValid(playerId)) throw new ContentError(`${playerId} is not a valid id`)

    validate.string(quizId)
    validate.string.notVoid('quizId', quizId)
    if (!ObjectId.isValid(quizId)) throw new ContentError(`${quizId} is not a valid id`)

    return (async () => {
        let quiz = await Quiz.findById(quizId)

        if (!quiz) throw new NotFoundError('quiz not found')


        let { questions, currentQuestion } = quiz

        for (i=0; i<answers.length; i++) {
            validate.string(answers[i])
            validate.string.notVoid('answers[i]', answers[i])
            if (!ObjectId.isValid(answers[i])) throw new ContentError('invalid id')
        }

        response = new Response({player: playerId, answers})

        questions[currentQuestion].responses.push(response)

        await quiz.save()

        return quiz

    })()
}
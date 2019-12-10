const { validate, errors: { NotFoundError, ContentError, ConflictError } } = require('quizzard-util')
const { ObjectId, models: { User, Quiz } } = require('quizzard-data')

module.exports = function (quizId) {

    // validate.string(id)
    // validate.string.notVoid('id', id)
    // if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(quizId)
    validate.string.notVoid('quizId', quizId)
    if (!ObjectId.isValid(quizId)) throw new ContentError(`${quizId} is not a valid id`)

    return (async () => {
        let quiz = await Quiz.findById(quizId)

        if (!quiz) throw new NotFoundError('quiz not found')

        // if (quiz.owner.toString() !== id) throw new ConflictError('only the owner of this quiz can do this action')

        quiz.currentQuestion ++

        await quiz.save()

        return quiz

    })()
}
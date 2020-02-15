const { validate, errors: { ConflictError, NotFoundError, ContentError } } = require('quizzard-util')
const { ObjectId, models: { User, Quiz } } = require('quizzard-data')


module.exports = function (id, quizId) {

    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid user id`)

    validate.string(quizId)
    validate.string.notVoid('quizId', quizId)
    if (!ObjectId.isValid(quizId)) throw new ContentError(`${quizId} is not a valid quiz id`)

    return (async () => {

        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        let quiz = await Quiz.findById(quizId)

        if (!quiz) throw new NotFoundError(`user does not have quiz with id ${quizId}`)

        if (quiz.owner.toString() !== id.toString()) throw new ConflictError(`user with id ${id} does not correspond to quiz with id ${quizId}`)

        quiz.status = 'finished'
        quiz.currentQuestion = -1
        quiz.players = undefined

        const { questions } = quiz

        questions.forEach(question => {
            question.startTime = undefined
            question.status = 'finished'
            question.resultsCalculated = false
            question.responses = undefined
        });

        await quiz.save()

        return quiz

    })()

}
const { validate, errors: { NotFoundError, ContentError, ConflictError } } = require('quizzard-util')
const { ObjectId, models: { Quiz } } = require('quizzard-data')

module.exports = function (quizId) {


    validate.string(quizId)
    validate.string.notVoid('quizId', quizId)
    if (!ObjectId.isValid(quizId)) throw new ContentError(`${quizId} is not a valid id`)



    return (async () => {
        const quiz = await Quiz.findById(quizId)

        if (!quiz) throw new NotFoundError('quiz not found')


        const { currentQuestion, questions } = quiz
        
        if (currentQuestion >= questions.length) throw new ConflictError('Question not found, please contact to the administrator')
        if (questions[currentQuestion].status === 'started') {
            return true
        } else {
            return false
        }

        
}) ()
}

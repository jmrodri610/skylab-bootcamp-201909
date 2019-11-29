const { validate, errors: { ConflictError, NotFoundError } } = require('quizzard-util')
const { ObjectId, models: { User, Quiz } } = require('quizzard-data')

module.exports = function (id, quizId, title, description, questions) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(quizId)
    validate.string.notVoid('quizId', quizId)
    if (!ObjectId.isValid(quizId)) throw new ContentError(`${quizId} is not a valid id`)


    if (title) {
        validate.string(title)
        validate.string.notVoid('title', title)
    }
    if (description) {
        validate.string(description)
        validate.string.notVoid('description', description)
    }


    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const quiz = await Quiz.findById(quizId)

        if (!quiz) throw new NotFoundError(`user does not have quiz with id ${quizId}`)

        if (quiz.owner.toString() !== id.toString()) throw new ConflictError(`user with id ${id} does not correspond to quiz with id ${quizId}`)

        const update = {}

        title && (update.title = title)
        description && (update.description = description)
        questions && (update.questions = questions)


        await Quiz.updateOne({ _id: ObjectId(quizId) }, { $set: update })
    })()
}
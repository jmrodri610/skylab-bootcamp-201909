const { validate, errors: { NotFoundError, ContentError } } = require('quizzard-util')
const { ObjectId, models: { User, Quiz } } = require('quizzard-data')

module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)


        const quizs = await Quiz.find({ owner: id }, { __v: 0 }).lean()

        quizs.forEach(quiz => {
            quiz.id = quiz._id.toString()
            delete quiz._id

            quiz.owner = id
        })
        debugger
        return quizs
    })()
}
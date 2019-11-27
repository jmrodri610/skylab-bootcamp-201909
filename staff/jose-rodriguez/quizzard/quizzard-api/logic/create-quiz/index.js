const { validate, errors: { NotFoundError } } = require('quizzard-util')
const { ObjectId, models: { User, Quiz,   }} = require('quizzard-data')

module.exports = function (id, title, description, questions) {
    
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(title)
    validate.string.notVoid('title', title)

    debugger
    

    return (async () => {
        const user = await User.findById(id)

        if(!user) throw new NotFoundError('user not found')

        const quiz = await Quiz.create({user: id, title, description, questions})

        return quiz.id
    })()
}
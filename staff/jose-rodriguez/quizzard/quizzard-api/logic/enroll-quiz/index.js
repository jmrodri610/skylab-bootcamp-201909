const { validate, errors: { NotFoundError } } = require('quizzard-util')
const { ObjectId, models: { Quiz, Player }} = require('quizzard-data')

module.exports = function (quizId, nickname) {
    
    validate.string(quizId)
    validate.string.notVoid('quizId', quizId)
    if (!ObjectId.isValid(quizId)) throw new ContentError(`${quizId} is not a valid id`)

    validate.string(nickname)
    validate.string.notVoid('nickname', nickname)

    debugger
    

    return (async () => {
        let quiz = await Quiz.findById(quizId)

        if(!quiz) throw new NotFoundError('quiz not found')

        const player = await Player.create({nickname})

        quiz = quiz.players.push(player)

        return player.id
    })()
}
const { validate, errors: { NotFoundError, ConflictError } } = require('quizzard-util')
const { ObjectId, models: { Quiz, Player }} = require('quizzard-data')

module.exports = function (quizId, nickname) {
    
    validate.string(quizId)
    validate.string.notVoid('quizId', quizId)
    if (!ObjectId.isValid(quizId)) throw new ContentError(`${quizId} is not a valid id`)

    validate.string(nickname)
    validate.string.notVoid('nickname', nickname)


    
    
    return (async () => {


        let quiz = await Quiz.findById(quizId)
    
        if(!quiz) throw new NotFoundError('quiz not found')
        
        
        if (quiz.status === 'started') {

            const { players } = quiz
            const player = new Player({nickname})
         
            players.push(player)

            await quiz.save()
            
            return { quiz, player: player._id }


        } else {
            throw new ConflictError('this quiz has not been started')
        }
    })()

}
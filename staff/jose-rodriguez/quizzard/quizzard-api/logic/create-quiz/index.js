const { validate, errors: { NotFoundError } } = require('quizzard-util')
const { ObjectId, models: { User, Quiz, Question, Answer } } = require('quizzard-data')

module.exports = function (id, title, description, questions) {


    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(title)
    validate.string.notVoid('title', title)

    validate.string(description)
    validate.string.notVoid('description', description)


    
    return (async () => {
        const user = await User.findById(id)
        
        if (!user) throw new NotFoundError('user not found')
        

        questions.forEach(async question => {
            const { text, answers, score, timing } = question
            answers.forEach(async answer => {
                const { text, valid } = answer
                answer =  await Answer.create({text, valid})
                await answers.push(answer) 
                        
                        
            })
            question = await Question.create({text, answers, score, timing})
            await questions.push(question)
            
            return questions
        })
        const quiz = await Quiz.create({ owner: id, title, description, questions })

        return quiz.id
    })()
}
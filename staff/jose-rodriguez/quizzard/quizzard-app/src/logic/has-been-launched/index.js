import call from '../../utils/call'
const { validate, errors: { NotFoundError, CredentialsError } } = require('quizzard-util')
const API_URL = process.env.REACT_APP_API_URL

//module.exports = function (quizId) {
export default function (quizId) {
    validate.string(quizId)
    validate.string.notVoid('quizId', quizId)

    return (async () => {
        
        
        const res = await call(`${API_URL}/play/question-check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quizId })
        })

        if (res.status === 200) {
            const quiz = JSON.parse(res.body)

            return quiz
        }

        
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}
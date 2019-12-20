import call from '../../utils/call'
const { validate, errors: { NotFoundError, CredentialsError } } = require('quizzard-util')
const API_URL = process.env.REACT_APP_API_URL

//module.exports = function (token, quizId) {
export default function (token, quizId) {
    validate.string(token)
    validate.string.notVoid('token', token)

    return (async () => {
        const res = await call(`${API_URL}/start-quiz`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quizId })
        })

        if (res.status === 201) {
            const quizs = JSON.parse(res.body)

            return quizs
        }

        
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}
const call = require('../../utils/call')
const { validate, errors: { NotFoundError, CredentialsError } } = require('quizzard-util')
const API_URL = process.env.REACT_APP_API_URL

module.exports = function ( quizId) {

    // validate.string(token)
    // validate.string.notVoid('token', token)

    validate.string(quizId)
    validate.string.notVoid('quizId', quizId)

    return (async () => {
        
        const res = await call(`${API_URL}/play/next`, {
            method: 'POST',
            headers: {
                // Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quizId })
        })

        if (res.status === 200) {
            
            return 
        }

        
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}
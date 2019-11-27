const { model } = require('mongoose')
const { user, quiz, question, answer, player, response } = require('./schemas')

module.exports = {
    User: model('User', user),
    Quiz: model('Quiz', quiz),
    Question: model('Question', question),
    Answer: model('Answer', answer),
    Player: model('Player', player),
    Response: model('Response', response)

}
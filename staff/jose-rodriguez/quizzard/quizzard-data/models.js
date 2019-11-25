const { model } = require('mongoose')
const { user, quiz } = require('./schemas')

module.exports = {
    User: model('User', user),
    Quiz: model('Quiz', quiz)
}
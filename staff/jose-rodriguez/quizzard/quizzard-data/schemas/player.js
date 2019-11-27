const { Schema } = require('mongoose')
const { Quiz } = require('./quiz')

module.exports = new Schema({
    nickname: {
        type: String,
        required: true
    },

    score: {
        type: Number,
        default: 0
    }

})


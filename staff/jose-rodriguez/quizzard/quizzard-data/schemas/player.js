const { Schema } = require('mongoose')


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


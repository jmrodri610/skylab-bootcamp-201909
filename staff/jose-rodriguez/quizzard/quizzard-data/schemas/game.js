const { Schema } = require('mongoose')
const { Quiz } = require('./quiz')

module.exports = new Schema({
    quiz: {
        type: ObjectId,
        ref: 'Quiz',
        required: true
    },

    pincode: {
        type: Number,
        required: true,
        default: Math.floor(Math.random()*1000000)
    },
    
    players: {
        type: Array,
        default: []
    },

    currentQuestion: {
        type: Number,
        default: 0
    },

    status: {
        enum: ['WAIT', 'GO', 'END']
    }

})


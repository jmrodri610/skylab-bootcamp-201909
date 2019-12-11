const { Schema, ObjectId } = require('mongoose')
const Question = require('./question')
const Player = require('./player')

module.exports = new Schema({
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['started', 'finished'],
        default: undefined
    },

    currentQuestion: {
        type: Number,
        default: -1
    },

    games: {
        type: Number,
        default: 0
    },

    players: [Player],

    questions: [Question]
})




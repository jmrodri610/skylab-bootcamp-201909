const { Schema, ObjectId } = require('mongoose')
const { Answer } = require('./answer')
const { Response } = require('./response')


module.exports = new Schema({
    text: {
        type: String,
        required: true
    },

    answers: [Answer],

    score: {
        type: Number,
        required: true
    },

    responses: [Response],

    timing: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ['started', 'finished'],
        default: undefined
    },

    startTime: Date

})

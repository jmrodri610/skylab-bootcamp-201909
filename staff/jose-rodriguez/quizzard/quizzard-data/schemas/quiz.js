const { Schema, ObjectId } = require('mongoose')

module.exports = new Schema({
    user: {
        type: ObjectId,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    pincode: {
        type: Number,
        required: true,
        value: Math.random()
    },

    players: {
        type: Array
    },

    rungame: Boolean,


    questions: [{
        description: String,
        answer: {
            aswer: String,
            status: Boolean
        }
    }]
})




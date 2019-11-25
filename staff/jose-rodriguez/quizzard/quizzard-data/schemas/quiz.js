const { Schema, ObjectId } = require('mongoose')

module.exports = new Schema({
    owner: {
        type: ObjectId,
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

    rungame: {
        type: Boolean
    },

    questions: [question]
})




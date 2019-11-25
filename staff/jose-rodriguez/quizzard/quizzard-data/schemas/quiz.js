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

    rungame: Boolean,


    questions: [{
        description: String,
        answer: {
            aswer: String,
            status: Boolean
        }
    }]
})




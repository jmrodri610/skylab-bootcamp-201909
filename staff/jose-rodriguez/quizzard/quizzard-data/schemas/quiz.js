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

    rungame: Boolean,


    questions: [{
        description: String,
        answer: {
            aswer: String,
            status: Boolean
        }
    }]
})




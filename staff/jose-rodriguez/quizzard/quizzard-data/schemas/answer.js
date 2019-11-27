const { Schema } = require('mongoose')


module.exports = new Schema ({

    text: {
        type: String,
        required: true
    },

    valid: {
        type: Boolean,
        required: true
    }

})




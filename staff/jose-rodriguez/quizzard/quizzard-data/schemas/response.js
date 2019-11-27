const { Schema, ObjectId } = require('mongoose')

module.exports = new Schema ({

    player: ObjectId,

    answers: [ ObjectId ]
})
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

module.exports = {
    database: {
        connect(url) {
            mongoose.connect(url, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
        },
        disconnect() {
            mongoose.disconnect()
        }
    },
    models: require('./models'),
    ObjectId
}
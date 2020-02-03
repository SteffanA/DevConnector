// Create our schema
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // Attach the avatar to the user right away
    avatar: {
        type: String
    },
    data: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('user', UserSchema)
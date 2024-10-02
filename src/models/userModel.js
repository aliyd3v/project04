const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    chatId: Number,
    name: String,
    username: String,
    language: String,
    phone: String,
    admin: {
        type: Boolean,
        default: false
    },
    action: String,
    createdAt: Date
})

exports.userModel = mongoose.model('User', userSchema)
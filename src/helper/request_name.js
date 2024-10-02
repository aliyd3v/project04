const { bot } = require("../bot");
const { userModel } = require("../models/userModel");
const { profile } = require("./profile");

exports.request_name = async msg => {
    const chatId = msg.chat.id
    const text = msg.text

    let user = await userModel.findOne({ chatId }).lean()
    user.name = text
    await userModel.findByIdAndUpdate(user._id, { ...user, action: 'menu' }, { new: true })
    return profile(msg)
}
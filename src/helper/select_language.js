const { bot } = require("../bot");
const { uzLang, ruLang, enLang } = require("../components/components");
const { userModel } = require("../models/userModel");
const { menu } = require("./menu");

exports.selectLanguage = async msg => {
    const chatId = msg.chat.id
    const text = msg.text
    let user = await userModel.findOne({ chatId }).lean()
    if (user) {
        if (user.action === 'select_language') {
            if (text === uzLang) {
                user.language = 'uz'
                user.action = 'menu'
                await userModel.findByIdAndUpdate(user._id, user, { new: true })
                return menu(chatId)
            } else if (text === ruLang) {
                user.language = 'ru'
                user.action = 'menu'
                await userModel.findByIdAndUpdate(user._id, user, { new: true })
                return menu(chatId)
            } else if (text === enLang) {
                user.language = 'en'
                user.action = 'menu'
                await userModel.findByIdAndUpdate(user._id, user, { new: true })
                return menu(chatId)
            }
        }
    }
}
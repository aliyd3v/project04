const { bot } = require("../bot");
const { selectLanguage, uzLang_toLowerCase, uzLang, ruLang, enLang } = require("../components/components");
const { userModel } = require("../models/userModel");
const { menu } = require("./menu");

exports.start = async msg => {
    const chatId = msg.chat.id
    let checkUser = await userModel.findOne({ chatId }).lean()
    if (!checkUser) {
        if (msg.from.username) {
            await userModel.create({
                chatId,
                username: msg.from.username,
                action: 'select_language',
                createdAt: new Date()
            })
        } else {
            await userModel.create({
                chatId,
                action: 'select_language',
                createdAt: new Date()
            })
        }
        bot.sendMessage(chatId, '🇺🇿 Tilni tanlang.\n🇷🇺 Выберите язык.\n🇬🇧 Select a language.', {
            reply_markup: {
                keyboard: [
                    [uzLang],
                    [ruLang],
                    [enLang]
                ],
                resize_keyboard: true
            }
        })
    } else {
        if (!checkUser.language) {
            bot.sendMessage(chatId, '🇺🇿 Tilni tanlang.\n🇷🇺 Выберите язык.\n🇬🇧 Select a language.', {
                reply_markup: {
                    keyboard: [
                        [uzLang],
                        [ruLang],
                        [enLang]
                    ],
                    resize_keyboard: true
                }
            })
        } else {
            checkUser.action = 'menu'
            await userModel.findByIdAndUpdate(checkUser._id, checkUser, { new: true }).lean()
            return menu(chatId)
        }
    }
}
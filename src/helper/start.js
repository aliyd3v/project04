const { bot } = require("../bot");
const { selectLanguage, uzLang_toLowerCase, uzLang, ruLang, enLang } = require("../components/components");
const { userModel } = require("../models/userModel");
const { menu } = require("./menu");
const { sendDataToSheetDB } = require("./send_to_sheetdb");

exports.start = async msg => {
    const chatId = msg.chat.id
    let checkUser = await userModel.findOne({ chatId }).lean()
    if (!checkUser) {
        let createdAt = new Date()
        if (msg.from.username) {
            await userModel.create({
                chatId,
                username: msg.from.username,
                action: 'select_language',
                createdAt
            })
        } else {
            await userModel.create({
                chatId,
                action: 'select_language',
                createdAt
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
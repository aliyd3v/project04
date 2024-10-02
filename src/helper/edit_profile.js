const { bot } = require("../bot")
const { userModel } = require('../models/userModel')

exports.edit_profile = async chatId => {
    let user = await userModel.findOne({ chatId }).lean()
    if (user.action === 'edit_profile') {
        if (user.language === 'uz') {
            bot.sendMessage(chatId, `🔄 Profilni o'zgartirish`, {
                reply_markup: {
                    remove_keyboard: true,
                    inline_keyboard: [
                        [{
                            text: `✍️ Ism va familiyani o'zgartirish`,
                            callback_data: 'update_name'
                        }],
                        [{
                            text: `🌐 Tilni o'zgartirish`,
                            callback_data: 'update_language'
                        }],
                        [{
                            text: `📞 Telefon raqamni o'zgartirish`,
                            callback_data: `update_phone`
                        }],
                        [{
                            text: `❌ Profilni o'chirish`,
                            callback_data: `delete_profile`
                        }],
                        [{
                            text: `⬅️ Orqaga`,
                            callback_data: `back_to_profile`
                        }]
                    ]
                }
            })
        } else if (user.language === 'ru') {
            bot.sendMessage(chatId, `🔄 Изменить профиль`, {
                reply_markup: {
                    remove_keyboard: true,
                    inline_keyboard: [
                        [{
                            text: `✍️ Изменение имени и фамилии`,
                            callback_data: 'update_name'
                        }],
                        [{
                            text: `🌐 Изменить язык`,
                            callback_data: 'update_language'
                        }],
                        [{
                            text: `📞 Изменить номер телефона`,
                            callback_data: `update_phone`
                        }],
                        [{
                            text: `❌ Удалить профиль`,
                            callback_data: `delete_profile`
                        }],
                        [{
                            text: `⬅️ Назад`,
                            callback_data: `back_to_profile`
                        }]
                    ]
                }
            })
        } else if (user.language === 'en') {
            bot.sendMessage(chatId, `🔄 Change profile`, {
                reply_markup: {
                    remove_keyboard: true,
                    inline_keyboard: [
                        [{
                            text: `✍️ Change of name and surname`,
                            callback_data: 'update_name'
                        }],
                        [{
                            text: `🌐 Change the language`,
                            callback_data: 'update_language'
                        }],
                        [{
                            text: `📞 Change phone number`,
                            callback_data: `update_phone`
                        }],
                        [{
                            text: `❌ Delete profile`,
                            callback_data: `delete_profile`
                        }],
                        [{
                            text: `⬅️ Back`,
                            callback_data: `back_to_profile`
                        }]
                    ]
                }
            })
        }
    }
}
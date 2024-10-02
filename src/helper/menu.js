const { bot } = require("../bot");
const { uzLang, uz_menu, uz_news, uz_weather, uz_profile, ru_menu, ru_news, ru_weather, ru_profile, en_menu, en_news, en_weather, en_profile } = require("../components/components");
const { userModel } = require("../models/userModel");

exports.menu = async (chatId) => {
    let user = await userModel.findOne({ chatId }).lean()

    if (user.action === 'menu') {
        if (user.language === 'uz') {
            bot.sendMessage(chatId, uz_menu, {
                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        [uz_news],
                        [uz_weather],
                        [uz_profile]
                    ],
                    resize_keyboard: true
                }
            })
        } else if (user.language === 'ru') {
            bot.sendMessage(chatId, ru_menu, {
                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        [ru_news],
                        [ru_weather],
                        [ru_profile]
                    ],
                    resize_keyboard: true
                }
            })
        } else if (user.language === 'en') {
            bot.sendMessage(chatId, en_menu, {
                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        [en_news],
                        [en_weather],
                        [en_profile]
                    ],
                    resize_keyboard: true
                }
            })
        }
    }
}
const { bot } = require("./bot")
const { uzLang, ruLang, enLang, uz_menu, ru_menu, en_menu, uz_profile, ru_profile, en_profile, uz_weather, ru_weather, en_weather, uz_news, ru_news, en_news } = require("./components/components")
const { delete_profile } = require("./helper/delete_profile")
const { news } = require("./helper/news")
const { profile } = require("./helper/profile")
const { request_contact } = require("./helper/request_contact")
const { request_name } = require("./helper/request_name")
const { selectLanguage } = require("./helper/select_language")
const { start } = require("./helper/start")
const { weather } = require("./helper/weather")
const { userModel } = require("./models/userModel")


bot.on('message', async msg => {
    const chatId = msg.chat.id
    const text = msg.text
    let user = await userModel.findOne({ chatId }).lean()

    if (text === '/start') {
        return start(msg)
    }
    if (user) {
        if (text === uzLang || text === ruLang || text === enLang) {
            return selectLanguage(msg)
        } else if (text === uz_profile || text === ru_profile || text === en_profile) {
            return profile(msg)
        } else if (text === uz_weather || text === ru_weather || text === en_weather) {
            if (user.language === 'uz') {
                bot.sendMessage(chatId, `📍 Joylashuvingizni yuboring`, {
                    reply_markup: {
                        one_time_keyboard: true,
                        keyboard: [
                            [
                                {
                                    text: '📍 Joylashuvni yuborish',
                                    request_location: true
                                }
                            ]
                        ],
                        resize_keyboard: true
                    }
                })
            } else if (user.language === 'ru') {
                bot.sendMessage(chatId, `📍 Отправьте свое местоположение`, {
                    reply_markup: {
                        one_time_keyboard: true,
                        keyboard: [
                            [
                                {
                                    text: '📍 Отправить местоположение',
                                    request_location: true
                                }
                            ]
                        ],
                        resize_keyboard: true
                    }
                })
            } else if (user.language === 'en') {
                bot.sendMessage(chatId, `📍 Send your location`, {
                    reply_markup: {
                        one_time_keyboard: true,
                        keyboard: [
                            [
                                {
                                    text: '📍 Send location',
                                    request_location: true
                                }
                            ]
                        ],
                        resize_keyboard: true
                    }
                })
            }
            user.action = 'request_location'
            return await userModel.findByIdAndUpdate(user._id, user, { new: true })
        } else if (msg.location) {
            if (user.action === 'request_location') {
                return weather(msg)
            }
        } else if (text === uz_news || text === ru_news || text === en_news) {
            return news(msg)
        } else {
            if (user.action === 'request_name') {
                return request_name(msg)
            } else if (user.action === 'request_contact') {
                return request_contact(msg)
            } else if (user.action === 'delete_profile') {
                return delete_profile(msg)
            }
        }
    }
})
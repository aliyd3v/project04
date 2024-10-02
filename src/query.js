const { bot } = require("./bot");
const { uzLang, ruLang, enLang } = require("./components/components");
const { edit_profile } = require("./helper/edit_profile");
const { menu } = require("./helper/menu");
const { news } = require("./helper/news");
const { profile } = require("./helper/profile");
const { userModel } = require("./models/userModel");

bot.on('callback_query', async query => {
    const { data } = query
    const chatId = query.from.id
    let user = await userModel.findOne({ chatId }).lean()

    if (data === 'menu') {
        user.action = 'menu'
        await userModel.findByIdAndUpdate(user._id, user, { new: true })
        return menu(chatId)
    }
    if (data === 'edit_profile') {
        user.action = 'edit_profile'
        await userModel.findByIdAndUpdate(user._id, user, { new: true })
        return edit_profile(chatId)
    }
    if (data === 'back_to_profile') {
        user.action = 'menu'
        await userModel.findByIdAndUpdate(user._id, user, { new: true })
        return profile(query)
    }
    if (data === 'update_name') {
        if (user.language === 'uz') {
            bot.sendMessage(chatId, `Ism va familiyangizni kiriting`)
        } else if (user.language === 'ru') {
            bot.sendMessage(chatId, `Введите свое имя и фамилию`)
        } else if (user.language === 'en') {
            bot.sendMessage(chatId, `Enter your first and last name`)
        }
        user.action = 'request_name'
        await userModel.findByIdAndUpdate(user._id, user, { new: true })
    }
    if (data === 'update_language') {

        if (user.language === 'uz') {
            bot.sendMessage(chatId, '🌐 Tilni tanlang', {
                reply_markup: {
                    keyboard: [
                        [uzLang],
                        [ruLang],
                        [enLang]
                    ],
                    resize_keyboard: true
                }
            })
        } else if (user.language === 'ru') {
            bot.sendMessage(chatId, '🌐 Выберите язык', {
                reply_markup: {
                    keyboard: [
                        [uzLang],
                        [ruLang],
                        [enLang]
                    ],
                    resize_keyboard: true
                }
            })
        } else if (user.language === 'en') {
            bot.sendMessage(chatId, '🌐 Select a language', {
                reply_markup: {
                    keyboard: [
                        [uzLang],
                        [ruLang],
                        [enLang]
                    ],
                    resize_keyboard: true
                }
            })
        }
        user.action = 'select_language'
        await userModel.findByIdAndUpdate(user._id, user, { new: true })
    }
    if (data === 'update_phone') {
        if (user.language === 'uz') {
            bot.sendMessage(chatId, '📞 Telefon raqamingizni yuboring', {
                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        [{
                            text: "📞 Telefon raqamni yuborish",
                            request_contact: true
                        }]
                    ],
                    resize_keyboard: true
                }
            })
        } else if (user.language === 'ru') {
            bot.sendMessage(chatId, '📞 Отправьте свой номер телефона', {
                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        [{
                            text: '📞 Отправить номер телефона',
                            request_contact: true
                        }]
                    ],
                    resize_keyboard: true
                }
            })
        } else if (user.language === 'en') {
            bot.sendMessage(chatId, '📞 Send your phone number', {
                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        [{
                            text: '📞 Send phone number',
                            request_contact: true
                        }]
                    ],
                    resize_keyboard: true
                }
            })
        }
        user.action = 'request_contact'
        await userModel.findByIdAndUpdate(user._id, user, { new: true })
    }
    if (data === 'delete_profile') {
        user.action = 'delete_profile'
        await userModel.findByIdAndUpdate(user._id, user, { new: true })
        if (user.language === 'uz') {
            bot.sendMessage(chatId, `Profilingizni o'chirishni xoxlasangiz "❌ O'chirish" tugmasini bosing`, {
                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        [`❌ O'chirish`],
                        [`⬅️ Orqaga`]
                    ],
                    resize_keyboard: true
                }
            })
        } else if (user.language === 'ru') {
            bot.sendMessage(chatId, `Если вы хотите удалить свой профиль, нажмите кнопку «❌ Удалить».`, {
                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        ['❌ Удалить'],
                        ['⬅️ Назад']
                    ],
                    resize_keyboard: true
                }
            })
        } else if (user.language === 'en') {
            bot.sendMessage(chatId, `If you want to delete your profile, click the "❌ Delete" button`, {
                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        ['❌ Delete'],
                        ['⬅️ Back']
                    ],
                    resize_keyboard: true
                }
            })
        }
    }
    if (data === 'next') {
        if (user.action.includes('page')) {
            let page = parseInt(user.action.split('-')[1])
            user.action = `page-${page + 1}`
            await userModel.findByIdAndUpdate(user._id, user, { new: true })
        } else {
            return news(query)
        }
        return await news(query)
    }
    if (data === 'prev') {
        if (user.action.includes('page')) {
            let page = parseInt(user.action.split('-')[1])
            if (page >= 0) {
                user.action = `page-${page - 1}`
                await userModel.findByIdAndUpdate(user._id, user, { new: true })
            }
        }
        return await news(query)
    }
})
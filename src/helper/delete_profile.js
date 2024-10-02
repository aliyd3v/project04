const { bot } = require("../bot");
const { userModel } = require("../models/userModel");
const { profile } = require("./profile");

exports.delete_profile = async msg => {
    const chatId = msg.chat.id
    const text = msg.text
    let user = await userModel.findOne({ chatId }).lean()

    if (user.language === 'uz') {
        if (text === "❌ O'chirish") {
            bot.sendMessage(chatId, `✅ Profilingiz muvoffaqiyatli o'chirildi. Botni ishlatish uchun "/start" tugmasini bosing.`, {
                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        ['/start']
                    ],
                    resize_keyboard: true
                }
            })
            return await userModel.findByIdAndDelete(user._id)
        }
        if (text === '⬅️ Orqaga') {
            return profile(msg)
        }
    } else if (user.language === 'ru') {
        if (text === "❌ Удалить") {
            bot.sendMessage(chatId, `✅ Ваш профиль успешно удален. Нажмите «/start», чтобы запустить бота..`, {
                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        ['/start']
                    ],
                    resize_keyboard: true
                }
            })
            return await userModel.findByIdAndDelete(user._id)
        }
        if (text === '⬅️ Назад') {
            return profile(msg)
        }
    } else if (user.language === 'en') {
        if (text === "❌ Delete") {
            bot.sendMessage(chatId, `✅ Your profile has been successfully deleted. Click "/start" to run the bot.`, {
                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        ['/start']
                    ],
                    resize_keyboard: true
                }
            })
            return await userModel.findByIdAndDelete(user._id)
        }
        if (text === '⬅️ Back') {
            return profile(msg)
        }
    }
}
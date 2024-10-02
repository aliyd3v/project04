const { bot } = require("../bot");
const { uzLang, ruLang, enLang } = require("../components/components");
const { userModel } = require("../models/userModel");

exports.profile = async msg => {
    const chatId = msg.from.id
    let user = await userModel.findOne({ chatId }).lean()

    if (user) {
        // UZ
        if (user.language === 'uz') {
            if (!user.name) {
                bot.sendMessage(chatId, `✍️ Ism va familiyangizni kiriting`)
                await userModel.findByIdAndUpdate(
                    user._id,
                    {
                        ...user,
                        action: 'request_name'
                    },
                    { new: true }
                )
            } else if (!user.phone) {
                bot.sendMessage(chatId, `📞 Telefon raqamingizni yuboring`, {
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
                await userModel.findByIdAndUpdate(
                    user._id,
                    {
                        ...user,
                        action: 'request_contact'
                    },
                    { new: true }
                )
            } else {
                if (user.username) {
                    bot.sendMessage(chatId, `👤 Profilingiz\n
✍️ Ism: ${user.name}\n
🌐 Til: ${uzLang}\n
📞 Telefon raqam: ${user.phone}\n
👤 Username: @${user.username}\n
🕔 Botga qo'shilgan vaqtingiz: ${user.createdAt.toLocaleString()}`, {
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: '🔄 Profilni o\'zgartirish',
                                    callback_data: 'edit_profile'
                                }],
                                [{
                                    text: "⬅️ Menyuga qaytish",
                                    callback_data: 'menu'
                                }]
                            ],
                            resize_keyboard: true,
                        }
                    })
                } else {
                    bot.sendMessage(chatId, `👤 Profilingiz\n
✍️ Ism: ${user.name}\n
🌐 Til: ${uzLang}\n
📞 Telefon raqam: ${user.phone}\n
🕔 Botga qo'shilgan vaqtingiz: ${user.createdAt.toLocaleString()}`, {
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: '🔄 Profilni o\'zgartirish',
                                    callback_data: 'edit_profile'
                                }],
                                [{
                                    text: "⬅️ Menyuga qaytish",
                                    callback_data: 'menu'
                                }]
                            ],
                            resize_keyboard: true,
                        }
                    })
                }
            }
        }



        // RU
        if (user.language === 'ru') {
            if (!user.name) {
                bot.sendMessage(chatId, `✍️ Введите свое имя и фамилию`)
                await userModel.findByIdAndUpdate(
                    user._id,
                    {
                        ...user,
                        action: 'request_name'
                    },
                    { new: true }
                )
            } else if (!user.phone) {
                bot.sendMessage(chatId, `📞 Отправьте свой номер телефона`, {
                    reply_markup: {
                        one_time_keyboard: true,
                        keyboard: [
                            [{
                                text: "📞 Отправить номер телефона",
                                request_contact: true
                            }]
                        ],
                        resize_keyboard: true
                    }
                })
                await userModel.findByIdAndUpdate(
                    user._id,
                    {
                        ...user,
                        action: 'request_contact'
                    },
                    { new: true }
                )
            } else {
                if (user.username) {
                    bot.sendMessage(chatId, `👤 Ваш профиль\n
✍️ Имя: ${user.name}\n
🌐 Язык: ${ruLang}\n
📞 Номер телефона: ${user.phone}\n
👤 Username: @${user.username}\n
🕔 Время, когда вы присоединились к боту: ${user.createdAt.toLocaleString()}`, {
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: '🔄 Изменить профиль',
                                    callback_data: 'edit_profile'
                                }],
                                [{
                                    text: "⬅️ Вернуться в меню",
                                    callback_data: 'menu'
                                }]
                            ],
                            resize_keyboard: true,
                        }
                    })
                } else {
                    bot.sendMessage(chatId, `👤 Ваш профиль\n
✍️ Имя: ${user.name}\n
🌐 Язык: ${ruLang}\n
📞 Номер телефона: ${user.phone}\n
🕔 Время, когда вы присоединились к боту: ${user.createdAt.toLocaleString()}`, {
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: '🔄 Изменить профиль',
                                    callback_data: 'edit_profile'
                                }],
                                [{
                                    text: "⬅️ Вернуться в меню",
                                    callback_data: 'menu'
                                }]
                            ],
                            resize_keyboard: true,
                        }
                    })
                }
            }
        }



        // EN
        if (user.language === 'en') {
            if (!user.name) {
                bot.sendMessage(chatId, `✍️ Enter your first and last name`)
                await userModel.findByIdAndUpdate(
                    user._id,
                    {
                        ...user,
                        action: 'request_name'
                    },
                    { new: true }
                )
            } else if (!user.phone) {
                bot.sendMessage(chatId, `📞 Send your phone number`, {
                    reply_markup: {
                        one_time_keyboard: true,
                        keyboard: [
                            [{
                                text: "📞 Send phone number",
                                request_contact: true
                            }]
                        ],
                        resize_keyboard: true
                    }
                })
                await userModel.findByIdAndUpdate(
                    user._id,
                    {
                        ...user,
                        action: 'request_contact'
                    },
                    { new: true }
                )
            } else {
                if (user.username) {
                    bot.sendMessage(chatId, `👤 Your profile\n
✍️ Name: ${user.name}\n
🌐 Language: ${enLang}\n
📞 Phone number: ${user.phone}\n
👤 Username: @${user.username}\n
🕔 The time you joined the bot: ${user.createdAt.toLocaleString()}`, {
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: '🔄 Change profile',
                                    callback_data: 'edit_profile'
                                }],
                                [{
                                    text: "⬅️ Back to menu",
                                    callback_data: 'menu'
                                }]
                            ],
                            resize_keyboard: true,
                        }
                    })
                } else {
                    bot.sendMessage(chatId, `👤 Your profile\n
✍️ Name: ${user.name}\n
🌐 Language: ${enLang}\n
📞 Phone number: ${user.phone}\n
🕔 The time you joined the bot: ${user.createdAt.toLocaleString()}`, {
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: '🔄 Change profile',
                                    callback_data: 'edit_profile'
                                }],
                                [{
                                    text: "⬅️ Back to menu",
                                    callback_data: 'menu'
                                }]
                            ],
                            resize_keyboard: true,
                        }
                    })
                }
            }
        }
    }
}
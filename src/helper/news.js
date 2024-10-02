const { bot } = require("../bot");
const { userModel } = require("../models/userModel");
const CurrentsApi = require('currentsapi')
const dotenv = require('dotenv')
const config = dotenv.config()
const currentsapi = new CurrentsApi(process.env.CURRENTS_API_TOKEN)
const { debug } = require('./debug');
const { translate } = require("./translate");
exports.news = async msg => {
    const chatId = msg.from.id
    let user = await userModel.findOne({ chatId }).lean()
    let News = await currentsapi.latestNews()

    if (News.status === '500') {
        if (user.language === 'uz') {
            return bot.sendMessage(chatId, `${await translate(News.msg, 'uz')}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '⬅️ Menyuga qaytish',
                            callback_data: 'menu'
                        }]
                    ]
                }
            })
        } else if (user.language === 'ru') {
            return bot.sendMessage(chatId, `${await translate(News.msg, 'ru')}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '⬅️ Вернуться в меню',
                            callback_data: 'menu'
                        }]
                    ]
                }
            })
        } else if (user.language === 'en') {
            return bot.sendMessage(chatId, `${News.msg}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '⬅️ Back to menu',
                            callback_data: 'menu'
                        }]
                    ]
                }
            })
        }
    }

    if (!user.action.includes('page')) {
        user.action = 'page-0'
        await userModel.findByIdAndUpdate(user._id, user, { new: true })
    }
    let page = parseInt(user.action.split('-')[1])


    let latest_news = []
    latest_news.push(...News.news)

    let defaultNewsPhoto = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrjp5jjw8oTsE0TUtUJuo0ahese0svE0JV2Q&s'
    let photoUrl = latest_news[page].image === 'None' ? defaultNewsPhoto : latest_news[page].image
    let title = latest_news[page].title
    let description = latest_news[page].description
    let author = latest_news[page].author
    let category = latest_news[page].category

    let published = latest_news[page].published
    let url = latest_news[page].url

    if (user.language === 'uz') {
        bot.sendPhoto(chatId, photoUrl, {
            caption: `Yangiliklar\n
Sarlavha: ${await translate(title, 'uz')}\n
Batafsil: ${await translate(description, 'uz')}\n
Muallif: ${await translate(author, 'uz')}\n
Kategoriya: ${await translate(category, 'uz')}\n
Nashr etilgan vaqt: ${published}

Havola: ${url}`,
            reply_markup: {
                inline_keyboard: [
                    [page != 0 ? {
                        text: '◀️ Oldingisi',
                        callback_data: 'prev'
                    } : { text: '', callback_data: 'null' },
                    {
                        text: `${page + 1}`,
                        callback_data: 'null'
                    },
                    {
                        text: 'Keyingisi ▶️',
                        callback_data: 'next'
                    }],
                    [{
                        text: '⬅️ Menyuga qaytish',
                        callback_data: 'menu'
                    }]
                ]
            }
        })
            .then(console.log(`News is successfully sended.`))
            .catch(error => console.log(error))
    } else if (user.language === 'ru') {
        bot.sendPhoto(chatId, photoUrl, {
            caption: `Новости\n
Заголовок: ${await translate(title, 'ru')}\n
Подробно: ${await translate(description, 'ru')}\n
Автор: ${await translate(author, 'ru')}\n
Категория: ${await translate(category, 'ru')}\n
Время публикации: ${published}

Связь: ${url}`,
            reply_markup: {
                inline_keyboard: [
                    [page != 0 ? {
                        text: '◀️ Предыдущий',
                        callback_data: 'prev'
                    } : { text: '', callback_data: 'null' },
                    {
                        text: `${page + 1}`,
                        callback_data: 'null'
                    },
                    {
                        text: 'Следующий ▶️',
                        callback_data: 'next'
                    }],
                    [{
                        text: '⬅️ Вернуться в меню',
                        callback_data: 'menu'
                    }]
                ]
            }
        })
            .then(console.log(`News is successfully sended.`))
            .catch(error => console.log(error))
    } else if (user.language === 'en') {
        bot.sendPhoto(chatId, photoUrl, {
            caption: `News\n
Title: ${title}\n
Description: ${description}\n
Author: ${author}\n
Category: ${category}\n
Published time: ${published}

Link: ${url}`,
            reply_markup: {
                inline_keyboard: [
                    [page != 0 ? {
                        text: '◀️ Previous',
                        callback_data: 'prev'
                    } : { text: '', callback_data: 'null' },
                    {
                        text: `${page + 1}`,
                        callback_data: 'null'
                    },
                    {
                        text: 'Next ▶️',
                        callback_data: 'next'
                    }],
                    [{
                        text: '⬅️ Back to menu',
                        callback_data: 'menu'
                    }]
                ]
            }
        })
            .then(console.log(`News is successfully sended.`))
            .catch(error => console.log(error))
    }
}
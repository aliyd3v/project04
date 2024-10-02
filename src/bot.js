const dotenv = require('dotenv')
const config = dotenv.config()
const token = process.env.BOT_TOKEN
const telegramBot = require('node-telegram-bot-api')
const bot = new telegramBot(token, { polling: true })
const { userModel } = require('../src/models/userModel')

module.exports = { bot }

require('./message')
require('./query')
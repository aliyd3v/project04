const { connectMongoDB } = require('./src/database/db')

// Setup MongoDB.
connectMongoDB()

// Setup Bot.
require('./src/bot')

// Logging on console.
console.log(`BOT HAS BEEN STARTED`)
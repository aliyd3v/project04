const express = require('express')
const app = express()

const { connectMongoDB } = require('./src/database/db')

// Setup MongoDB.
connectMongoDB()

// Setup Bot.
require('./src/bot')

// Logging on console.
app.listen(3555, () => {
    console.log(`
______________________________________________
    
<----SERVER HAS BEEN STARTED ON PORT: 3555---->
______________________________________________
`)
})
console.log(`
______________________________
    
<----BOT HAS BEEN STARTED---->
______________________________
`)
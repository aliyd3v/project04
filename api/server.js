import http from 'http'
import { Server } from 'socket.io'
import app from './app.js'
import { port } from './src/config/config.js'
import registerSocketHandler from './socket/index.js'

// Setup server.
const server = http.createServer(app)

// Setup socket.io.
const io = new Server(server, {
    cors: { origin: '*' }
})

// Register Socket handler.
registerSocketHandler(io)

// Setup server port.
server.listen(port, () => console.log(`Server running on port ${port}`))
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//let count = 0

//server(emit) -> client(receive) - count updated
//client(emit) -> server(receive) - increment

io.on('connection', (socket) => {
    console.log('new WebSocket connection')

    // socket.emit('countUpdated', count)
    // socket.on('increment', () => {
    //     count++;
    //     // socket.emit('countUpdated', count) will reflect changrs to onlt respective client socket
    //     io.emit('countUpdated', count) //will reflect changes to all the connections
    // })
    socket.emit('message', generateMessage('Welcome!'))

    socket.broadcast.emit('message', generateMessage('A new User has joined!!'))
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!!')
        }
        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        //io.emit('message', `Location: ${coords.latitude}, ${coords.longitude}`)
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left !'))
    })
})



server.listen(port, () => {
    console.log(`server is up on port ${port}!`)
})
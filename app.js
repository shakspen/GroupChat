const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`server on port ${PORT}`)) 

const io = require('socket.io')(server)

io.on('connection',onConnected)

let socketsConnected = new Set()

function onConnected(socket){
    console.log(socket.id);
    socketsConnected.add(socket.id)

    io.emit('clients-total', socketsConnected.size)

    socket.on("disconnect",()=>{
        console.log("Socket Disconnected",socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total', socketsConnected.size)
    })

    socket.on('messageSend',(data)=>{
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback',(data) =>{
        socket.broadcast.emit('feedback', data)
    })
}

app.use(express.static(path.join(__dirname,"public")))
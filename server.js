const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

server.listen(process.env.PORT || 3000, _=>{
    console.log("[SERVER] Gestartet");
});

io.on('connection', socket=>{
    console.log("[SERVER] Ein Client-Socket hat sich verbunden");
    socket.on('sendMsg', data=>{
        
    });
});
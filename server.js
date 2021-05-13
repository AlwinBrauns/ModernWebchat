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
    let roomNr = 0;
    console.log("[SERVER] Ein Client-Socket hat sich verbunden");
    //Socket wird in die Standardgruppe "default" getan
    socket.join("room"+roomNr);

    socket.on('sendMsg', data=>{
        console.log("[SERVER] Eine Nachricht wurde geschickt: " + data.username + " | " + data.message);
        socket.to("room"+roomNr).emit('receiveMsg', data);
    });

    socket.on('disconnect', function(){
        console.log("[SERVER] Ein Client-Socket hat sich getrennt");
    
    });
});


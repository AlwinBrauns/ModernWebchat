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

var dbRequestParameters = {
    host: 'localhost',
    port: 3001,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
};

io.on('connection', socket=>{
      
    dbRequestParameters.path = '/getmsgs';
    var req = http.request(dbRequestParameters, onResponse);
    req.write("{\"pw\": \"mysecretkeytogetdata\"}");
    req.end();

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

function onResponse(response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });
  
    response.on('end', function () {
      console.log(JSON.parse(str));
    });
  }
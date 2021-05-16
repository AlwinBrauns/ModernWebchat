const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const { response } = require('express');
const server = http.createServer(app);
const io = socketio(server);
const sha256 = require('js-sha256').sha256;

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
var dbResponse = {};

io.on('connection', socket=>{
      
    //Standarduser: "Gast"
    let user = {
        username: "Gast",
        pw: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
    };
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

    socket.on('login', data=>{
        user.username = data.username;
        user.pw = data.pw;
        dbRequestParameters.path = "/login";
        req = http.request(dbRequestParameters, function(response){
            var str = ''
            response.on('data', function (chunk) {
                str += chunk;
            });
        
            response.on('end', function () {
                dbResponse = JSON.parse(str);
                console.log("[SERVER] User Login versuch: ");
                console.log(dbResponse);
                if(dbResponse[0]?.username == user.username &&
                    dbResponse[0]?.pw == user.pw){
                    socket.emit('login', "Erfolgreich");
                }else{
                    socket.emit('login', "Erfolglos");
                }
            });
        });
        user.pw = sha256(user.pw);
        req.write(`
            {
                "username": "${user.username}",
                "pw": "${user.pw}"
            }
        `);
        req.end();
    })

    socket.on('register', data=>{
        console.log(data);
        //TODO: register
        dbRequestParameters.path = "/register";
        req = http.request(dbRequestParameters, function(response){
            var str = ''
            response.on('data', function (chunk) {
                str += chunk;
            });
        
            response.on('end', function () {
                dbResponse = JSON.parse(str);
                console.log("[SERVER] User Login versuch: ");
                console.log(dbResponse);
                if(dbResponse?.username == data.username &&
                    dbResponse?.pw == data.pw){
                    socket.emit('register', "Erfolgreich");
                }else{
                    socket.emit('register', "Username gibt es schon");
                }
            });
        });
        data.pw = sha256(data.pw);
        req.write(`
            {
                "username": "${data.username}",
                "pw": "${data.pw}"
            }
        `);
        req.end();
    })
});
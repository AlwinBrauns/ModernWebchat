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
        id: 1,
        username: "Gast",
        pw: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
        bildpfad: "./imgs/default-avatar.png"
    };
    //Default-Raum mit ID 1
    let roomNr = 1;


    console.log("[SERVER] Ein Client-Socket hat sich verbunden");
    //Socket wird in die Standardgruppe "default" getan
    socket.join(`room${roomNr}`);

    socket.on('needMsgs', data=>{
        //Alle Nachrichten bekommen
        dbRequestParameters.path = "/getmsgs";
        req = http.request(dbRequestParameters, function(response){
            var str = ''
            response.on('data', function (chunk) {
                str += chunk;
            });
        
            response.on('end', function () {
                dbResponse = JSON.parse(str);
                dbResponse.forEach(function(msg,index){
                    setTimeout(function () {
                        socket.emit('receiveMsg', msg);
                        console.log(msg);
                      }, index * 33);
                });
                
            });
        });
        req.write(`{ "group": ${roomNr} }`);
        req.end();
    });
    socket.on('sendMsg', data=>{
        console.log("[SERVER] Eine Nachricht wurde geschickt:");
        dbRequestParameters.path = "/message";
        req = http.request(dbRequestParameters, function(response){
            var str = ''
            response.on('data', function (chunk) {
                str += chunk;
            });
        
            response.on('end', function () {
                dbResponse = JSON.parse(str);
                console.log(dbResponse);

                //TODO: better date format
                io.to(`room${roomNr}`).emit('receiveMsg', JSON.parse(`
                {
                    "datum": "${Date()}",
                    "from_id": "${user.id}",
                    "msg": "${data.message}",
                    "username": "${user.username}"
                }
                `));
            });
        });
        req.write(`{
            "msg": "${data.message}",
            "toID": ${roomNr},
            "fromID": ${user.id}
        }`);
        req.end();
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
                console.log("[SERVER] User Login: ");
                if(dbResponse[0]?.username == user.username &&
                    dbResponse[0]?.pw == user.pw){
                    user.id = dbResponse[0].id;
                    user.bildpfad = dbResponse[0].bildpfad;
                    console.log(user);
                    socket.emit('login', "Erfolgreich");
                }else{
                    user.username = "Gast";
                    user.pw = "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3";
                    console.log("Erfolglos :(")
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
    });

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
                console.log("[SERVER] User Register versuch: ");
                console.log(dbResponse);
                if(dbResponse[0].username == data.username &&
                    dbResponse[0].pw == data.pw){
                    socket.emit('register', "Erfolgreich");
                    user.id = dbResponse[0].id;
                    user.username = dbResponse[0].username;
                    user.pw = dbResponse[0].pw;
                    user.bildpfad = dbResponse[0].bildpfad;
                    console.log("[SERVER] NEW USER: ");
                    console.log(user);
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
    });

    socket.on('log-out', _=>{
        console.log("[SERVER] User Log-Out:");
        console.log(user);
        user = {
            id: 1,
            username: "Gast",
            pw: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
            bildpfad: "./imgs/default-avatar.png"
        };
        
        socket.emit('log-out');
    });
});
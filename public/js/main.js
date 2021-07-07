const socket = io();
var messageHandler = new MessageHandler(socket);
const accountSettings = document.getElementById('account-settings');

nachrichtFormular.addEventListener('submit', e=>{
    e.preventDefault();
    messageHandler.updateData();
    messageHandler.sendMsg();
    messageHandler.cleanFormular();
});

document.getElementById('login').addEventListener('submit', e=>{
    e.preventDefault();
    socket.emit('login', {
        username: document.getElementById('login-name').value,
        pw: document.getElementById('login-pw').value
    });
});

document.getElementById('joinRoom').addEventListener('click', e=>{
    e.preventDefault();
    let roomNr = document.getElementById('roomNr').value;
    let roomName = document.getElementById('roomName').value;
    socket.emit('join-room', {
        roomNr: roomNr,
        roomName: roomName
    });
});

document.getElementById('createRoom').addEventListener('click', e=>{
    e.preventDefault();
    let roomNr = document.getElementById('roomNr').value;
    let roomName = document.getElementById('roomName').value;
    socket.emit('create-room', {
        roomNr: roomNr,
        roomName: roomName
    });
});

document.getElementById('register').addEventListener('submit', e=>{
    e.preventDefault();
    socket.emit('register', {
        username: document.getElementById('register-name').value,
        pw: document.getElementById('register-pw').value
    });
});

document.getElementById('log-out').addEventListener('click', e=>{
    socket.emit('log-out');
});

socket.on('log-out', _=>{
    accountPanel.style.display = "flex";
    accountSettings.style.display = "none";
})

socket.on('login', data=>{
    if(data=="Erfolgreich")
    {
        accountPanel.style.display = "none";
        accountSettings.style.display = "flex";
        nachrichtTextfeld.focus();
    }else{
        alert(data);
    }
});

socket.on('register', data=>{
    if(data=="Erfolgreich")
    {
        accountPanel.style.display = "none";
        accountSettings.style.display = "flex";
        nachrichtTextfeld.focus();
    }else{
        alert(data);
    }
});

socket.on('receiveMsg', data=>messageHandler.receiveMsg(data));

socket.on('join-room', data=>{
    if(data.status == false){
        alert(data.message);
    }else {
        if(data.need){
            // Need to add button
            //TODO: update room buttons
            messageHandler.cleanMsg();
            socket.emit('needMsgs');

        }else{
            // Only needs to update msgs
            messageHandler.cleanMsg();
            socket.emit('needMsgs');
        }
    }
});

socket.emit('needMsgs');


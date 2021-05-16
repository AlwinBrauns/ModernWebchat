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

document.getElementById('register').addEventListener('submit', e=>{
    e.preventDefault();
    socket.emit('register', {
        username: document.getElementById('register-name').value,
        pw: document.getElementById('register-pw').value
    });
});

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



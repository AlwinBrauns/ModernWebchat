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

socket.on('receiveMsg', data=>{
    
    let msgTemplate = document.getElementById("msgTemplate");
    let newMsg = msgTemplate.content.cloneNode(true);

    getChildByName(newMsg, "MsgText").textContent = data.msg;
    getChildByName(newMsg, "MsgDatum").textContent = data.datum;
    getChildByName(newMsg, "MsgUsername").textContent = data.username?data.username:"Not Implemented yet";
    
    document.getElementById("chat-msgs").appendChild(newMsg);

    
});

function getChildByName(parent, name){
    let child = undefined;
    for (var index = 0; index < parent.children.length; index++){
        if(parent.children[index].attributes?.name?.value == name){
            child = parent.children[index];
            return child;
        }else{
            child = getChildByName(parent.children[index], name);
            if(child!=undefined){
                return child;
            }
        }
    }
    return undefined;
}

socket.emit('needMsgs');


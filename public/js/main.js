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

document.getElementById('joinOrCreateRoom').addEventListener('submit', e=>{
    e.preventDefault();
    let roomName = (document.getElementById('room').children[0].value)
                .substr(0, (document.getElementById('room').children[0].value).indexOf('#'));
    let roomNr = parseInt((document.getElementById('room').children[0].value)
                .substr((document.getElementById('room').children[0].value).indexOf('#')+1));
    if(e.submitter.value=="join"){
        socket.emit('join-room', {
            roomNr: roomNr,
            roomName: roomName
        });
    }else{
        socket.emit('create-room', {
            roomNr: roomNr,
            roomName: roomName
        });
    }
    
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
    cleanRoomButtons();
    socket.emit('needGroups');
})

socket.on('login', data=>{
    if(data=="Erfolgreich")
    {
        accountPanel.style.display = "none";
        accountSettings.style.display = "flex";
        nachrichtTextfeld.focus();
        cleanRoomButtons();
        socket.emit('needGroups');
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
        window.console.log(data);

        if(data.need){
            // Need to add button
            addRoomButton(data.roomName,data.roomNr)
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

function addRoomButton(roomname, index) {
    let template = document.getElementById("raumButtonTemplate");
    let newButton = template.content.cloneNode(true);
    getChildByName(newButton, "JoinRoom").textContent = roomname;
    getChildByName(newButton, "JoinRoom").value = index;
    getChildByName(newButton, "JoinRoom").addEventListener('click', e=>{
        window.console.log(e.target.value);
        socket.emit('join-room', {
            roomNr: e.target.value,
            roomName: ""
        });
    });
    let roomButtonsContainer = document.getElementById("roomButtons");
    roomButtonsContainer.appendChild(newButton);
}

function cleanRoomButtons() {
    let roomButtonsContainer = document.getElementById("roomButtons");
    while(getChildByName(roomButtonsContainer, "JoinRoom")){
        getChildByName(roomButtonsContainer, "JoinRoom").remove();
    }
}

socket.emit('needGroups');
socket.on('needGroups',data=>{
        addRoomButton(data.groupname, data.id);
});

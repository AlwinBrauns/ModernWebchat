const socket = io();
var messageHandler = new MessageHandler(socket);


nachrichtFormular.addEventListener('submit', e=>{
    e.preventDefault();
    messageHandler.updateData();
    messageHandler.sendMsg();
    messageHandler.cleanFormular();
});


const socket = io();
var msg = new MessageHandler(socket);

nachrichtFormular.addEventListener('submit', e=>{
    e.preventDefault();
    msg.updateData();
    msg.sendMsg();
    msg.cleanFormular();
})
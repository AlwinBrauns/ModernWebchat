const nachrichtTextfeld = document.getElementById("nachricht");
const nachrichtFormular = document.getElementById("nachrichten-form");

class MessageHandler{
    constructor(socket){
        this.message = "-";
        this.socket = socket;
    }
    sendMsg() {
        this.socket.emit('sendMsg', {
            message: this.message,
        });
    }
    cleanFormular(){
        nachrichtFormular.reset();
    }
    updateData(){
        //TODO: this.username = /* NAMENSABFRAGE */
        this.message = nachrichtTextfeld.value;
    }
    receiveMsg(data){
        window.console.log(data);

        let msgTemplate = document.getElementById("msgTemplate");
        let newMsg = msgTemplate.content.cloneNode(true);

        getChildByName(newMsg, "MsgText").textContent = data.msg;
        getChildByName(newMsg, "MsgDatum").textContent = new Date(Date.parse(data.datum)).toUTCString();
        getChildByName(newMsg, "MsgUsername").textContent = data.username;
        
        let chatMessages = document.getElementById("chat-msgs");
        chatMessages.appendChild(newMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}
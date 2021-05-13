const nachrichtTextfeld = document.getElementById("nachricht");
const nachrichtFormular = document.getElementById("nachrichten-form");

class MessageHandler{
    constructor(socket){
        this.username = "-";
        this.message = "-";
        this.socket = socket;
    }
    sendMsg() {
        this.socket.emit('sendMsg', {
            username: this.username,
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

}
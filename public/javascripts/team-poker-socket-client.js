var TeamPoker = TeamPoker || { };
function SocketClient(serverUrl) {
    this.ServerUrl = serverUrl;
}

SocketClient.prototype = {
    Listeners: {},
    ServerUrl: "",
    connect: function() {
        this.socket = io.connect(this.ServerUrl), me = this;
        console.log("Connected to Socket server, namespace: \"teampoker\".");
        this.socket.on('teampoker', function (msg) {
            console.log("Client received message: ");
            console.log(msg);

            if(me.Listeners[msg.MsgType] && me.Listeners[msg.MsgType].length) {
                _(me.Listeners[msg.MsgType]).each(function (callback) {
                    callback(msg.Data);
                });
            }
        });
    },
    sendMsg: function(msgType, msgData) {
        this.socket.emit(msgType, msgData);
    },
    addListener: function(msgType, callback) {
        this.Listeners[msgType] = this.Listeners[msgType] || [];
        this.Listeners[msgType].push(callback);
    }
};

TeamPoker.SocketClient = new SocketClient('http://localhost:8080');
TeamPoker.SocketClient.connect();

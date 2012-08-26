function SocketClient(serverUrl) {
    this.ServerUrl = serverUrl;
}

SocketClient.prototype = {
    Listeners: {},
    ServerUrl: "",
    connect: function() {
        var socketOptions = {
                'sync disconnect on unload': false
            };
        this.socket = io.connect(this.ServerUrl, socketOptions);
        var me = this, namespace = location.pathname.substring(1);
        console.log("Connected to Socket server, namespace: \"" + namespace + "\".");
        this.socket.on(namespace, function (msg) {
            console.log("Client received message: ");
            console.log(msg);

            if(me.Listeners[msg.MsgType] && me.Listeners[msg.MsgType].length) {
                _(me.Listeners[msg.MsgType]).each(function (callback) {
                    console.log("Invoking Clinet Socket callback: " + callback);
                    callback(msg.Data);
                });
            }
            else {
                console.warn("Unhandled Socket Server message: ");
                console.log(msg);
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

TeamPoker.SocketClient = new SocketClient([location.protocol, "//", location.host].join(''));
TeamPoker.SocketClient.connect();

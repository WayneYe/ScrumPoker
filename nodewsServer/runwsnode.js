/*
WebSocket server based on
https://github.com/ncr/node.ws.js
Written By Wayne Ye 6/4/2011
http://wayneye.com
*/

var sys = require("sys"),
    ws = require("./ws");

var clients = [], players = [], voteStatus = [];

ws.createServer(function (websocket) {
    websocket.addListener("connect", function (resource) {
        // emitted after handshake
        sys.debug("Client connected on path: " + resource);

        // # Add to our list of clients
        clients.push(websocket);
        
        //sys.debug(traverseObj(websocket));
        
    }).addListener("data", function (data) {        
        var clinetMsg = JSON.parse(data);

		switch (clinetMsg.Type) { 
		    case MessageType.NewParticipaint:
		    	var newPlayer = clinetMsg.Data;
				sys.debug('New Participaint: ' + newPlayer);
		        players.push(newPlayer);
        		
		    	break;
		    case MessageType.NewVoteInfo:
		    	var newVoteInfo = clinetMsg.Data;
		    	sys.debug('New VoteInfo: ' + newVoteInfo.PlayerName + ' voted ' + newVoteInfo.VoteValue);
	        	voteStatus.push(newVoteInfo);
		    	break;
		    default:
		    	break;
		}
        
        // Notify all clients except the one just sent data
		var serverStatus = new ServerStatus();
		serverStatus.Players = players;
		serverStatus.VoteStatus = voteStatus;
		
		var srvMsgData = JSON.stringify(serverStatus);
		
        sys.debug('Broadcast server status to all clients: ' + srvMsgData);
        for(var i = 0; i < clients.length; i++)
			clients[i].write(srvMsgData);
    }).addListener("close", function () {
        // emitted when server or client closes connection
        
        for (var i = 0; i < clients.length; i++) {
			// # Remove from our connections list so we don't send
			// # to a dead socket
			if (clients[i] == websocket) {
				sys.debug("close with client: " + websocket);
				clients.splice(i);
				break;
			}
		}
    });
}).listen(8888);

var MessageType = {
    NewParticipaint: 'NewParticipaint',
    NewVoteInfo: 'NewVoteInfo'
};
function ClientMessage(type, data) {
    this.Type = type;
    this.Data = data;
};
function VoteInfo(playerName, voteValue) {
    this.PlayerName = playerName;
    this.VoteValue = voteValue;
}
function ServerStatus() {
    this.Players = [];
    this.VoteStatus = [];
};



/*Util*/
function traverseObj(obj)
{
	var def = '';
	for(var key in obj)
		def += key + ': ' + obj[key];
		
	return def;
}

/*
var counter = 1;
function sendMsgToClient(ws) {
    sys.debug(counter + "");
    ws.write(counter++ + "");
    setTimeout(sendMsgToClient(ws), 1000);

    if (counter == 10) return;
}*/

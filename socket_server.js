/*
   Team poker WebSocket server based on http://socket.io
   Written By Wayne Ye 07/20/2012 - http://wayneye.com
   */

var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')
, _  = require('underscore')
, colors = require('colors');

var pid = 1
, participantsList = []
, voteStatus = []
, MessageType = {
    LoginCallback: 'LoginCallback',
    NewParticipaint: 'NewParticipaint',
    LeaveParticipaint: 'LeaveParticipaint',
    NewVoteInfo: 'NewVoteInfo',
    ViewVoteResult: 'ViewVoteResult',
    GameStatus: 'GameStatus'
};

app.listen(8080);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    });
}

io.sockets.on('connection', function (socket) {
    const TEAM_POKER_CHANNEL = "teampoker";
    socket.emit(TEAM_POKER_CHANNEL , { MsgType: MessageType.GameStatus, Data: { ParticipantsList: participantsList, VoteStatus: voteStatus } });

    socket.on('login_event', function(loginName) {
        console.log("New participant: " + loginName.bold.underline.blue);
        //socket.log.info("New participant: " + loginName);
        participantsList.push({ id: pid++, name: loginName });
        socket.emit(TEAM_POKER_CHANNEL, { MsgType: MessageType.LoginCallback, Data: { Success: "true", ParticipantsList: participantsList } });
        socket.broadcast.emit(TEAM_POKER_CHANNEL, { MsgType: MessageType.NewParticipant, Data: { ParticipantsList: participantsList } });
    });

    socket.on('leave_participant_event', function (name) {
        console.log("Left participant: " + name.bold.underline.yellow);
        //socket.log.info("New participant: " + name);
        //socket.broadcast.emit(TEAM_POKER_CHANNEL, { MsgType: MessageType.NewParticipant, Data: { id: pid, name: name } });
    });

    socket.on('vote_event', function(voteInfo) {
        console.log(["New vote for story: " + voteInfo.StoryId +", by: ", voteInfo.VoterName, ", value: ", voteInfo.VoteVal.bold.cyan, "."].join(''));
        //var VoteResultPair = function(voterName, voteVal, storyId) {
            //this.VoterName = voterName;
            //this.VoteVal = voteVal;
            //this.StoryId = storyId;
        //};
        //voteStatus.push(new VoteResultPair(voteInfo.Name, voteInfo.Value, voteInfo));
        voteStatus.push(voteInfo);
        //socket.emit(TEAM_POKER_CHANNEL, { MsgType: MessageType.NewVoteInfo, Data: { VoterName: voteInfo.Name, Value: voteInfo.Value } });
    });

    socket.on('view_result_event', function(voteInfo) {
        socket.emit(TEAM_POKER_CHANNEL, { MsgType: MessageType.ViewVoteResult, Data: { VoteStatus: voteStatus } });
    });
});

io.sockets.on('disconnect', function (socket) {
    io.sockets.emit(TEMM_POKET_CHANNEL, { MsgType: MessageType.LeaveParticipaint, Data: { id: 0 } });
});
/*
 *

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

var counter = 1;
function sendMsgToClient(ws) {
    sys.debug(counter + "");
    ws.write(counter++ + "");
    setTimeout(sendMsgToClient(ws), 1000);

    if (counter == 10) return;
}
* 
*/

/**
 * Module dependencies.
 */
var express = require('express')
, app = express()
, routes = require('./routes')
, http = require('http')
, fs = require('fs')
, server = http.createServer(app)
, _  = require('underscore')
, io = require('socket.io').listen(server)
, SocketServer = require('./socket_server');

process.env.PORT = 80;

app.configure(function(){
    app.set('port', process.env.PORT);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon(__dirname + '/public/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

//app.get('/', routes.index);
app.get('/', function(req, res){
    res.sendfile(__dirname + '/public/index.html');
});
app.post('/', function(req, res) {
    var moderatorName   = decodeURIComponent(req.body['txt-nickname']),
        roomName   = decodeURIComponent(req.body['txt-room-name']),
        storiesStr = decodeURIComponent(req.body['txt-stories']);

    var storiesCollection = {};
    if(storiesStr.length) {
        if(storiesStr.indexOf('\r\n') === -1)
            storiesCollection[1] = storiesStr;
        else {
            var storyId = 1;
            _.each(storiesStr.split('\r\n'), function (s) {
                storiesCollection[storyId++] = { Title: s, Point: 0 };
            });
        }
    }
    var roomInfo = {
        Moderator: moderatorName,
        Name: roomName,
        ParticipantCollection : {},
        StoryCollection : storiesCollection,
        VoteStatus : [],
    };
    createGameRoom(roomInfo);

    res.status(302);
    res.set({
        'Location': [req.protocol, "://", req.host, "/", roomName].join('')
    });
    res.end();
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

server.listen(process.env.PORT);

function createGameRoom(roomInfo) {
    // 1. Starts WebSocket server and listening on the room namespace
    var socketServer = new SocketServer(app, io, roomInfo);
    socketServer.start();

    // 2. Creates route for serving upcoming room members
    routes[roomInfo.Name] = function(req, res) {
        res.sendfile(__dirname + '/public/team-poker.html');
    };
    app.get('/' + roomInfo.Name, routes[roomInfo.Name]);
}

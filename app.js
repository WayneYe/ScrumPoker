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
, SocketServer = require('./socket_server')
, path = require('path')
//, gzippo = require('gzippo')
//, staticAsset = require('static-asset')
, env = 'development';

process.env.PORT = process.env.PORT || 80;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

app.configure(function(){
  app.set('port', process.env.PORT);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  //app.use(express.bodyParser());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.compress());
  app.use(express.static(path.join(__dirname, 'public')));
  //app.use(staticAsset(__dirname + "/public/javascripts"));
  //app.use(staticAsset(__dirname + "/public/stylesheets"));

  this.set('env', process.env.NODE_ENV || 'development');
  env = this.get('env');
  console.log('Express booting in %s mode', env);

  app.use(express.static(__dirname + '/public'));
  //app.use(gzippo.staticGzip(__dirname + '/public'));
});

app.get('/', routes.index);
//app.get("/info", function(req, res) {
  //res.type("text/plain").send("The URL fingerprint for jQuery is: " +
                              //req.assetFingerprint("/javascripts/vendor/jquery-1.8.0.min.js") );
//});
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
  app.use(express.logger('dev'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.logger());
  app.use(express.errorHandler()); 
});

server.listen(process.env.PORT);

function createGameRoom(roomInfo) {
  // 1. Starts WebSocket server and listening on the room namespace
  var socketServer = new SocketServer(app, io, roomInfo);
  socketServer.start();

  // 2. Creates route for serving upcoming room members
  routes[roomInfo.Name] = function(req, res) {
    res.render('teampoker', { env: env });
  };
  app.get('/' + roomInfo.Name, routes[roomInfo.Name]);
}

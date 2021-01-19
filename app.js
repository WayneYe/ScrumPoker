/**
 * Module dependencies.
 */
var express = require('express')
, app = express()
, compress = require('compression')
, routes = require('./routes')
, http = require('http')
, errorHandler = require('errorhandler')
, favicon = require('serve-favicon')
, fs = require('fs')
, methodOverride = require('method-override')
, morgan = require('morgan')
, server = http.createServer(app)
, io = require('socket.io')(server)
, SocketServer = require('./socket_server')
, path = require('path')
, _ = require('underscore')
//, gzippo = require('gzippo')
//, staticAsset = require('static-asset')
, env = 'development';

process.env.PORT = process.env.PORT || 80;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


app.set('port', process.env.PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(methodOverride());
//app.use(app.router);
app.use(compress());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(staticAsset(__dirname + "/public/javascripts"));
//app.use(staticAsset(__dirname + "/public/stylesheets"));

app.set('env', process.env.NODE_ENV || 'development');
env = app.get('env');
console.log('Express booting in %s mode', env);

app.use(express.static(__dirname + '/public'));
//app.use(gzippo.staticGzip(__dirname + '/public'));


app.get('/', routes.index);
//app.get("/info", function(req, res) {
  //res.type("text/plain").send("The URL fingerprint for jQuery is: " +
                              //req.assetFingerprint("/javascripts/vendor/jquery-1.8.0.min.js") );
//});
app.post('/', function(req, res) {
  var moderatorName   = req.body['txt-nickname'],
  roomName   = req.body['txt-room-name'],
  storiesStr = req.body['txt-stories'];

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
    Name: encodeURIComponent(roomName.replace(' ','-').replace('(','').replace(')','')),
    ParticipantCollection : {},
    StoryCollection : storiesCollection,
    VoteStatus : [],
  };
  createGameRoom(roomInfo);
  console.log("Created new room ==============================");
  console.log(roomInfo);

  res.status(302);
  res.set({
    'Location': [req.protocol, "://", req.host, "/", roomInfo.Name].join('')
  });
  res.end();
});

if(app.get('env') === 'development'){
  app.use(morgan('dev'));
  app.use(errorHandler({ dumpExceptions: true, showStack: true })); 
} else {
  app.use(morgan());
  app.use(errorHandler()); 
}

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

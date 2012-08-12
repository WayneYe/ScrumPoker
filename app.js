/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, http = require('http')
, app = express()
, fs = require('fs');

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

app.configure('development', function(){
  app.use(express.errorHandler());
});

var server = http.createServer(app);
server.listen(process.env.PORT, function(){
  console.log("Express server listening on port " + process.env.PORT);
});
//io.listen(server);

//socket.io
//io.sockets.on('connection', function (socket) {
  //socket.emit('news', { hello: 'world' });
  //socket.on('my other event', function (data) {
    //console.log(data);
  //});
//});



/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: __dirname + '/public/uploads',
    limit: '5mb'
  }));
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/:id', routes.attend);
app.post('/present', routes.present) 

var server = http.createServer(app);
server.listen(3000);

io = io.listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('next', function (data) {
    socket.broadcast.emit('next_slide', 'next slide');
  });
  socket.on('previous', function (data) {
    socket.broadcast.emit('previous_slide', 'previous slide');
  });
});


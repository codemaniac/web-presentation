
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
server.listen(8080, '0.0.0.0');

io = io.listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('attend_presentation', function(data){
    socket.room = data.presentationID;
    socket.join(data.presentationID);
  });
  socket.on('next', function (data) {
    routes.presentations[socket.room].pgno++;
    io.sockets.in(socket.room).emit('next_slide');
  });
  socket.on('previous', function (data) {
    routes.presentations[socket.room].pgno--;
    io.sockets.in(socket.room).emit('previous_slide');
  });
  socket.on('presentation', function (data) {    
    io.sockets.in(socket.room).emit('show_presentation');
  });
  socket.on('whiteboard', function (data) {
    io.sockets.in(socket.room).emit('show_whiteboard');
  });
  socket.on('presenterDraw', function (data) {
    io.sockets.in(socket.room).emit('draw', {x: data.x, y: data.y, type: data.type});
  });
});


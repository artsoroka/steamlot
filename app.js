var http = require('http');
var path = require('path');

var socketio = require('socket.io');
var express = require('express');
var bodyParser = require("body-parser"); 
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

var DB = require('./db'); 
var db = new DB(); 

var broadcast = function(event, data){
    sockets.forEach(function(socket){
       socket.emit('newBid', data);  
    });
}; 

db.on('newBid', function(msg){
    broadcast('newBid', msg); 
}); 

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false })); 

app.get('/game_bets', function(req,res){
  db.getAll(function(data){
    res.send(JSON.stringify(data)); 
  }); 
}); 

app.post('/bid', function(req,res){
   db.newBid({
        userId: req.body.user_id || 0,  
        artifactId: req.body.artifact_id || 0 
   }); 
   res.send('new bid was made');  
});

var messages = []; 
var sockets  = []; 

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');
      console.log(text); 
      if (!text)
        return;
      
      socket.broadcast.emit('message', msg);
      messages.push(msg);

    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        if(err) console.log(err); 
      });
    });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

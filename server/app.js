var http = require('http');
var path = require('path');
var socketio    = require('socket.io');
var express     = require('express');
var bodyParser  = require("body-parser"); 
var Database    = require('./db'); 
var config      = require("./config"); 

var app     = express();
var routes  = require('./routes'); 
var server  = http.createServer(app);
var io      = socketio.listen(server);
var db      = new Database(config.db); 
var sockets = []; 

app.use(express.static(path.resolve(__dirname, '../webapp')));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use('/', routes(db)); 

var broadcast = function(event, data){
    sockets.forEach(function(socket){
       socket.emit('newBid', data);  
    });
}; 

db.on('newBid', function(msg){
    broadcast('newBid', msg); 
}); 

app.use(express.static(path.resolve(__dirname, '../webapp')));
app.use(bodyParser.urlencoded({ extended: false })); 

app.get('/game_bets', function(req,res){
  db.getAll(function(data){
    res.set('Content-Type', 'text/json'); 
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

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
    });

});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

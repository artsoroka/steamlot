var EventEmitter = require("events").EventEmitter; 
var util         = require("util"); 

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'csuser',
  password : 'cspassword', 
  database : 'cs'
});

connection.connect();

function DataBase(config){
  
}

util.inherits(DataBase, EventEmitter); 

module.exports = DataBase; 

DataBase.prototype.newBid = function(entry){
  var self  = this; 
  var ts    = Date.now() / 1000 | 0; 
  var sql   = 'INSERT INTO game_bets(id, user_id, artifact_id, timestamp) VALUES(null, ?, ?, ?)'; 
  connection.query(sql, [entry.userId, entry.artifactId, ts], function(err, rows) {
    if (err) throw err;
    self.emit('newBid', entry); 
    console.log('The solution is: ', rows);
  });

};

//connection.end();


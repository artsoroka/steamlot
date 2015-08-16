var router = require('express').Router(); 

module.exports = function(db){
        
    router.get('/game_bets', function(req,res){
      db.getAll(function(data){
        res.send(JSON.stringify(data)); 
      }); 
    }); 
    
    router.post('/bid', function(req,res){
       db.newBid({
            userId: req.body.user_id || 0,  
            artifactId: req.body.artifact_id || 0 
       }); 
       res.send('new bid was made');  
    });
    
    return router; 

}; 
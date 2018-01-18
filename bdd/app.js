var app = require('express')(),
server = require('http').createServer(app),
io = require('socket.io').listen(server);

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'nodejs'
});

app.get('/', function(req,res){
    res.sendfile(__dirname+'/index.html');
});
connection.connect(function(err) {
    if (err) throw err;
});
io.sockets.on('connect', function(socket){


    socket.on('insert',function(data){
       if(parseInt(data.nb) >= 1){
           for(var i=1;i<data.nb;i++){
                var query = "INSERT INTO node (name,username) VALUES('"+data.nom+"','"+data.username+"')";
                connection.query(query,function(err,result){
                   if(err) throw err;

                });
            }
            socket.emit('insert_return',data.nb+" clones ont étaient créés");
        }
    });

    socket.on('fetch_users',function(){
       var query = ('SELECT * FROM node');
       connection.query(query,function(err,result,fields){
           if(err) throw err;
           socket.emit('fetch_users',result);
       })
    })
});

server.listen(3000);

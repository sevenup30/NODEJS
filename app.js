
// Code du serveur
var app = require('express')(), // Framework express permet de gérer les routes les parametres etc
    server = require('http').createServer(app), // On créer le serveur HTTP
    io = require('socket.io').listen(server), // Socket.io pour les transaction synchrone
    ent = require('ent'), // Permet d'escape les htmlentities
    fs = require('fs');

// On gère les routes
app.get('/', function(req,res){
   res.sendfile(__dirname+'/index.html');
});

// On initialise SOCKET.IO
io.sockets.on('connection', function(socket,pseudo){
    // On récupère le pseudo sur le parametre conenction
    // On l'insere dans la session et informe tout les utilisateurs du nouvel utilisateur

    socket.on('nouveau_client',function(pseudo){
       pseudo = ent.encode(pseudo);
       socket.pseudo = pseudo;
       socket.broadcast.emit('nouveau_client',pseudo);
    });

    // On fais la même chose pour les messages

    socket.on('message', function(message){
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    })
});

server.listen(8180);
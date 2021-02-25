var express = require('express');
var app = express();
var http = require('http');
var socketIo = require('socket.io')(http);

// start webserver on port 8080
var server =  http.createServer(app);
var io = socketIo.listen(server);
server.listen(8080);
// add directory with our static files
app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:8080");
var carta= [ { x:200,    y: 200,  palo : 'oros',  n : 1 , seleccionada : false},
             { x:200+40, y: 200,  palo : 'oros',  n : 2 , seleccionada : false} ]
for(var i in carta){console.log("carta "+i+" : "+parseInt(carta[i].x)+","+parseInt(carta[i].y), 8,40+i*20);}

io.on('connection', function (socket) {

  socket.emit('escena', { carta : carta } );

  socket.on('escena', function (data) {

  for(var i in data.carta){console.log("carta "+i+" : "+parseInt(data.carta[i].x)+","+parseInt(data.carta[i].y), 8,40+i*20);}

  io.emit('escena',  { carta : data.carta });
  carta=data.carta;
});

});

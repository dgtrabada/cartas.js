var express = require('express');
var app = express();
var http = require('http');
var socketIo = require('socket.io')(http);

// start webserver on port 8080
var server =  http.createServer(app);
var io = socketIo.listen(server);
server.listen(8069);
// add directory with our static files
app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:8069");


class Carta {
  constructor(x,y,palo,n,up,seleccionada) {
    this.x = x;
    this.y = y;
    this.palo = palo;
    this.n = n;
    if(n==8) this.n = "S";
    if(n==9) this.n = "C";
    if(n==10) this.n = "R";
    this.seleccionada = seleccionada;
    this.up = up
    this.label = this.n+" "+this.palo;
  }
}

var carta=[]

for (i=1;i<11;i++){
  const icarta = new Carta(200+40*i,80,'oros',i,true,false)
  carta.push(icarta)
}
for (i=1;i<11;i++){
  const icarta = new Carta(200+40*i,200,'copas',i,true,false)
  carta.push(icarta)
}
for (i=1;i<11;i++){
  const icarta = new Carta(200+40*i,320,'espadas',i,true,false)
  carta.push(icarta)
}
for (i=1;i<11;i++){
  const icarta = new Carta(200+40*i,440,'bastos',i,false,false)
  carta.push(icarta)
}
// { x:200,    y: 200,  palo : 'oros',  n : 1 , seleccionada : false},
// { x:200+40, y: 200,  palo : 'oros',  n : 2 , seleccionada : false} ]

var person = "test"
io.on('connection', function (socket) {

  socket.on('person', function (d) {
    person = d.person
    console.log(person)
  });

  socket.emit('escena', { carta : carta } );
  socket.on('escena', function (data) {
//  for(var i in data.carta){console.log("carta "+i+" : "+parseInt(data.carta[i].x)+","+parseInt(data.carta[i].y), 8,40+i*20);}
  io.emit('escena',  { carta : data.carta });
  carta=data.carta;
});

});

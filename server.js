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

var palo = ["oros","copas","bastos","espadas"]
var num = ["2","4","5","6","7","S","C","R","3","1"]

class Jugador {
  constructor(index,name,puntos,reparte,cantes,color){
    this.name=name
    this.index=index
    this.puntos=puntos
    this.reparte=reparte
    this.cantes=cantes
    this.color=color
  }
}
var jugador=[]
jugador.push(new Jugador(0,"dgtrabada",0,false,"","MediumSeaGreen"))
jugador.push(new Jugador(1,"dguerra",0,false,"","blue"))
jugador.push(new Jugador(2,"pangard",0,false,"","yellow"))
jugador.push(new Jugador(3,"alsubias",0,false,"","orange"))


class Carta {
  constructor(jugador,x,y,palo,n,up,seleccionada_por,tirada,visible) {
    this.x = x;
    this.y = y;
    this.palo = palo;
    this.n = n;
    this.seleccionada_por = seleccionada_por;
    this.up = up
    this.label = this.n+" "+this.palo;
    this.jugador=jugador;
    this.tirada = tirada;
    this.visible = visible;
    this.id=id;
  }
}

var carta=[]
Tx=Ty=800

var id=0
for (p=0;p<palo.length;p++){
  for (i=0;i<num.length;i++){
    // coincidencia cuatro jugadores y cuatro palos
    aux_x=[Tx/2,Tx/2,Tx/2,Tx/2]
    aux_y=[Ty/2,Ty/2,Ty/2,Ty/2]
    carta.push( new Carta(jugador[p],aux_x,aux_y,palo[p],num[i],false,"nadie",false,true) )
    id++;
  }
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function print_cartas(){
  for(i=0;i<40;i++) console.log(carta[i].jugador.name+" "+carta[i].n+" "+carta[i].palo+" "+carta[i].tirada+" "+carta[i].visible);
console.log("-------------")
}


io.on('connection', function (socket) {

  socket.emit('jugador', {  jugador : jugador });
  socket.emit('escena', { carta : carta } );

  socket.on('escena', function (data) {
    // print_cartas();
    io.emit('escena',  { carta : data.carta });
    carta=data.carta;
    });

  socket.on('jugador', function (data) {
    io.emit('jugador',  { jugador : data.jugador });
    jugador=data.jugador;
  //  for(j=0;j<jugador.length;j++){
  //    console.log(jugador[j].name+" "+jugador[j].log);
  //  }
    });

   socket.on('loggin', function (data) { console.log(data) ; });

});

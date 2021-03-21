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

class Jugador {
  constructor(index,name,puntos){
    this.name=name
    this.index=index
    this.puntos=puntos
  }
}
var jugador=[]
jugador.push(new Jugador(0,"dgtrabada",0))
jugador.push(new Jugador(1,"alsubias",0))
jugador.push(new Jugador(2,"pangard",0))
jugador.push(new Jugador(3,"dguerra",0))


class Carta {
  constructor(jugador,x,y,palo,n,up,seleccionada,tirada,visible) {
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
    this.jugador=jugador;
    this.tirada = tirada;
    this.visible = visible;
  }
}

var carta=[]
var ancho = 60
var largo = 100
Tx=Ty=600

for (p=0;p<palo.length;p++){
  for (i=1;i<11;i++){
    // coincidencia cuatro jugadores y cuatro palos
    aux_x=[200+40*i,80+p*120,Tx-(200+40*i),Tx-(80+p*120)]
    aux_y=[80+p*120,200+40*i,Tx-(80+p*120),Tx-(200+40*i)]
    carta.push( new Carta(jugador[p],aux_x,aux_y,palo[p],i,true,false,false,true) )
  }
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function print_cartas(){
  for(i=0;i<40;i++) console.log(carta[i].jugador.name+" "+carta[i].n+" "+carta[i].palo+" "+carta[i].tirada+" "+carta[i].visible);
console.log("-------------")
}

function barajar(){
  for(i=1;i<200;i++){
    i1 = getRndInteger(0,40);
    i2 = getRndInteger(0,40);
    aux = carta[i2].jugador;
    carta[i2].jugador = carta[i1].jugador;
    carta[i1].jugador = aux;
  }
}


//print_cartas();
barajar();
//print_cartas();


  id=ip=ia=ig=5

  for(i=0;i<40;i++) {
    //console.log(carta[i].jugador.name)
    if(carta[i].jugador.name=="dgtrabada"){
      id++;
      carta[i].x=[Tx/24*id,(Tx-ancho),Tx/24*id,ancho]
      carta[i].y=[(Ty-largo),Ty/24*id,largo/2,Ty/24*id]
      }
    if(carta[i].jugador.name=="alsubias"){
      ig++;
      carta[i].x=[ancho,Tx/24*ig,(Tx-ancho),Tx/24*ig]
      carta[i].y=[Ty/24*ig,(Ty-largo),Ty/24*ig,largo/2]
      }
    if(carta[i].jugador.name=="pangard"){
     ip++;
     carta[i].x=[Tx/24*ip,ancho,Tx/24*ip,(Tx-ancho)]
     carta[i].y=[largo/2,Ty/24*ip,(Ty-largo),Ty/24*ip]
     }
   if(carta[i].jugador.name=="dguerra"){
     ia++;
     carta[i].x=[(Tx-ancho),25*ia,ancho,25*ia]
     carta[i].y=[25*ia,largo/2,25*ia,(Ty-largo)]
     }
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

});

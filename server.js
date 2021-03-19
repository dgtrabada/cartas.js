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
  constructor(index,name){
    this.name=name
    this.index=index
  }
}

var jugador=[]
jugador.push(new Jugador(0,"dgtrabada"))
jugador.push(new Jugador(1,"alsubias"))
jugador.push(new Jugador(2,"pangard"))
jugador.push(new Jugador(3,"dguerra"))


class Carta {
  constructor(jugador,x,y,palo,n,up,seleccionada,giro) {
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
    this.giro = giro
    this.jugador=jugador
  }
}

var carta=[]
Tx=Ty=600

for (p=0;p<palo.length;p++){
  for (i=1;i<11;i++){
    // coincidencia cuatro jugadores y cuatro palos
    aux_x=[200+40*i,80+p*120,Tx-(200+40*i),Tx-(80+p*120)]
    aux_y=[80+p*120,200+40*i,Tx-(80+p*120),Tx-(200+40*i)]
    carta.push( new Carta(jugador[p],aux_x,aux_y,palo[p],i,true,false,0) )
  }
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function print_cartas(){
  for(i=0;i<40;i++) console.log(carta[i].jugador.name+" "+carta[i].n+" "+carta[i].palo);
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


  id=ip=ia=ig=4

  for(i=0;i<40;i++) {
    //console.log(carta[i].jugador.name)
    if(carta[i].jugador.name=="dgtrabada"){
      id++;
      carta[i].x=[30*id,500,30*id,80]
      carta[i].y=[500,25*id,40,25*id]
      }
    if(carta[i].jugador.name=="alsubias"){
      ig++;
      carta[i].x=[80,30*ig,500,30*ig]
      carta[i].y=[25*ig,500,25*ig,40]
      }
    if(carta[i].jugador.name=="pangard"){
     ip++;
     carta[i].x=[30*ip,80,30*ip,500]
     carta[i].y=[40,25*ip,500,25*ip]
     }
   if(carta[i].jugador.name=="dguerra"){
     ia++;
     carta[i].x=[500,30*ia,80,30*ia]
     carta[i].y=[25*ia,40,25*ia,500]
     }
  }




io.on('connection', function (socket) {

  socket.on('name', function (d) {
    var E = false
     for (j=0;j<jugador.length;j++) if (jugador[j].name == d.name) E = true
     if (E == false){
       for (j=0;j<jugador.length;j++){
         if (jugador[j].seleccionado == false){
           jugador[j].name=d.name
           jugador[j].seleccionado=true
           console.log("nuevo jugador "+j+" "+jugador[j].name)
           j=jugador.length
           socket.emit('escena', { carta : carta } );
          }
      }
    }
  });

  socket.emit('escena', { carta : carta } );
  socket.on('escena', function (data) {
//  for(var i in data.carta){console.log("carta "+i+" : "+parseInt(data.carta[i].x)+","+parseInt(data.carta[i].y), 8,40+i*20);}
  io.emit('escena',  { carta : data.carta });
  carta=data.carta;
});

});

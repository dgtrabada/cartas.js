document.addEventListener("DOMContentLoaded", function() {
   var mouse = {
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   // get canvas element and create context
   var canvas  = document.getElementById('drawing');
   var context = canvas.getContext('2d');
   var width   = window.innerWidth;
   var height  = window.innerHeight;
   var socket  = io.connect();
   var carta = [];
   var jugador=[];
   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;
   var ancho = 60
   var largo = 100
   Tx=Ty=600
   var mensaje = "inicio de partida"

  // var index = Math.floor(Math.random()*4)

   var index = 5;

   var nombre = prompt("Please enter your name:","");
   if(nombre == "dgtrabada") index=0
   if(nombre == "alsubias") index=1
   if(nombre == "pangard") index=2
   if(nombre == "dguerra") index=3




   // register mouse event handlers
   canvas.onmousedown = function(e){
   mouse.click = true;
   mouse.pos.x = e.clientX ;
   mouse.pos.y = e.clientY ;
   for (i=0;i<carta.length;i++) {
    if(carta[i].visible){
       if(mouse.pos.x>carta[i].x[index] && mouse.pos.x<(carta[i].x[index]+ancho) && mouse.pos.y>carta[i].y[index] && mouse.pos.y<(carta[i].y[index]+largo)){
         carta[i].seleccionada=true;
         i=carta.length
         }
       }
     }
     if(mouse.pos.x>630 && mouse.pos.x<655 &&  mouse.pos.y >(400-0) &&  mouse.pos.y <(400+25) ){
       repartir();
     }

     if(mouse.pos.x>630 && mouse.pos.x<655 && mouse.pos.y >(440-0) &&  mouse.pos.y <(440+25) ){
       cantar_renuncio();
     }

     if(mouse.pos.x>630 && mouse.pos.x<655 && mouse.pos.y >(480-0) &&  mouse.pos.y <(480+25) ){
       jugador[index].puntos+=20
       llevar_cartas();
     }
     if(mouse.pos.x>630 && mouse.pos.x<655 && mouse.pos.y >(520-0) &&  mouse.pos.y <(520+25) ){
       jugador[index].puntos+=40
       llevar_cartas()
     }
     if(mouse.pos.x>630 && mouse.pos.x<655 && mouse.pos.y >(560-0) &&  mouse.pos.y <(560+25) ){
       llevar_cartas()
     }

    };
   canvas.onmouseup = function(e){
      mouse.click = false;
      for (i=0;i<carta.length;i++) {
        if(carta[i].seleccionada){
        if((Math.pow(carta[i].x[index]-330,2)+(Math.pow(carta[i].y[index]-325,2)))<Math.pow(160,2)){
          carta[i].tirada=true;
        }
      }
        carta[i].seleccionada=false;

      }
      socket.emit('escena', {  carta : carta });
      drawCartas()

    };

   canvas.ondblclick  = function(e){
     mouse.pos.x = e.clientX ;
     mouse.pos.y = e.clientY ;

     for (i=0;i<carta.length;i++) {
      if(carta[i].visible){
         if(mouse.pos.x>carta[i].x[index] && mouse.pos.x<(carta[i].x[index]+ancho) && mouse.pos.y>carta[i].y[index] && mouse.pos.y<(carta[i].y[index]+largo)){
          carta[i].up=!(carta[i].up);
          }
        }
      }
      socket.emit('escena', {  carta : carta });
      drawCartas()
    };

   canvas.onmousemove = function(e) {
      // normalize mouse position to range 0.0 - 1.0
      mouse.pos.x = e.clientX ;
      mouse.pos.y = e.clientY;
      mouse.move = true;
      if(mouse.click) drawCartas()
      botones()
   };

  function llevar_cartas(){
    for (i=0;i<carta.length;i++) {
      if (carta[i].tirada){
        carta[i].visible=false;
        carta[i].tirada=false;
        carta[i].jugador=jugador[index];

        if(carta[i].n==1)jugador[index].puntos+=11
        if(carta[i].n==3)jugador[index].puntos+=10
        if(carta[i].n=="S")jugador[index].puntos+=2
        if(carta[i].n=="C")jugador[index].puntos+=3
        if(carta[i].n=="R")jugador[index].puntos+=4

        socket.emit('jugador', {  jugador : jugador });
      }
     }
    }
    function getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function repartir(){
      for(i=0;i<40;i++){
          carta[i].up=true;
          carta[i].jugador=jugador[i%4];
          carta[i].tirada=false;
          carta[i].visible=true;
          }//mezclamos

       for(i=1;i<200;i++){
          i1 = getRndInteger(0,40);
          i2 = getRndInteger(0,40);
          aux = carta[i2].jugador;
          carta[i2].jugador = carta[i1].jugador;
          carta[i1].jugador = aux;
          }//repartimos

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
      socket.emit('escena', {  carta : carta });
      for (j=0;j<jugador.length;j++) {jugador[j].puntos=0 }
      socket.emit('jugador', {  jugador : jugador });

    }

    function cantar_renuncio(){
      for (i=0;i<carta.length;i++) {
        if (carta[i].jugador.name==jugador[index].name ){
          for (j=0;j<jugador.length;j++){
            carta[i].x[j]=300+20-Math.floor(Math.random()*40)
            carta[i].y[j]=300+20-Math.floor(Math.random()*40)
            carta[i].tirada=true
            }
          }
        }
        socket.emit('escena', {  carta : carta });
        drawCartas()
     }

function poner_mensaje(){
  mensaje="";
  for (j=0;j<jugador.length;j++){
    mensaje=mensaje+" "+jugador[j].name+" "+jugador[j].puntos
 }
}

 function botones(){

   context.fillStyle = "rgb(255, 255, 0)"
   if(mouse.pos.x>630 && mouse.pos.x<655 && mouse.pos.y >(400-0) &&  mouse.pos.y <(400+25) ){context.fillStyle = "rgb(191, 255, 0)"}
   context.beginPath();
   context.fillRect (630, 400,25,25);
   context.fill();
   context.closePath();
   context.stroke();
   context.fillStyle = "rgb(255, 191, 0)"
   if(mouse.pos.x>630 && mouse.pos.x<655 && mouse.pos.y >(440-0) &&  mouse.pos.y <(440+25) ){context.fillStyle = "rgb(255, 0, 0)"}
   context.beginPath();
   context.fillRect (630, 440,25,25);
   context.fill();
   context.closePath();
   context.stroke();
   context.fillStyle = "rgb(191, 255, 0)"
   if(mouse.pos.x>630 && mouse.pos.x<655 && mouse.pos.y >(480-0) &&  mouse.pos.y <(480+25) ){context.fillStyle = "rgb(0, 255, 64)"}
   context.beginPath();
   context.fillRect  (630, 480,25,25);
   context.fill();
   context.closePath();
   context.stroke();
   context.fillStyle = "rgb(255, 0, 255)"
   if(mouse.pos.x>630 && mouse.pos.x<655 && mouse.pos.y >(520-0) &&  mouse.pos.y <(520+25) ){context.fillStyle = "rgb(191, 0, 255)"}
   context.beginPath();
   context.fillRect (630, 520,25,25);
   context.fill();
   context.closePath();
   context.stroke();
   context.fillStyle = "rgb(0, 255, 255)"
   if(mouse.pos.x>630 && mouse.pos.x<655 && mouse.pos.y >(560-0) &&  mouse.pos.y <(560+25) ){context.fillStyle = "rgb(64, 0, 255)"}
   context.beginPath();
   context.fillRect  (630, 560,25,25);
   context.fill();
   context.closePath();
   context.stroke();
 }

 function borrar(){
      context.beginPath();
      context.fillStyle = "rgb(255,255,255)"
      context.fillRect (0, 0, canvas.width, canvas.height);
      context.fill();
      context.closePath();
      // dibujamos la mesa
      context.beginPath();
      context.fillStyle = "green"
      context.fillRect (50, 50, 560, 550);
      context.fill();
      context.closePath();
      context.beginPath();
      context.arc(330, 325, 160, 0, 2 * Math.PI, false);
      context.fillStyle = 'MediumSeaGreen';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#003300';
      context.stroke();

      botones();
      context.font = "14px Arial";
      context.fillStyle = "#0095DD";
      context.fillText("Repartir",660,420);
      context.fillText("Renuncio",660,460);
      context.fillText("Cantar 20",660,500);
      context.fillText("Cantar 40",660,540);
      context.fillText("Llevar cartas",660,580);
 }

 function drawCartas(){

   borrar()
   context.lineWidth = 1;
   context.font = "14px Arial";
   context.fillStyle = "#0095DD";
   context.fillText("name = "+jugador[index].name,8,20);
   //context.fillText("("+parseInt(mouse.pos.x)+","+parseInt(mouse.pos.y)+")", 8,20);
   context.font = "12px Arial";
   context.fillStyle = "#0095DD";
   poner_mensaje();
   context.fillText(mensaje,8,40);

   for (i=0;i<carta.length;i++) {
   if(carta[i].visible){
       if(carta[i].seleccionada && mouse.click ){
         if(index == 0){
           carta[i].x[0]=mouse.pos.x-ancho/2;
           carta[i].y[0]=mouse.pos.y-largo/2;

           carta[i].x[1]=mouse.pos.y;
           carta[i].y[1]=Ty-mouse.pos.x+ancho/2;

           carta[i].x[2]=Tx-mouse.pos.x+ancho/2;
           carta[i].y[2]=Ty-mouse.pos.y;

          carta[i].x[3]=Tx-mouse.pos.y;
          carta[i].y[3]=mouse.pos.x-largo/2;
        }
         if(index == 3){
          carta[i].x[3]=mouse.pos.x-ancho/2;
          carta[i].y[3]=mouse.pos.y-largo/2;

          carta[i].x[0]=mouse.pos.y;
          carta[i].y[0]=Ty-mouse.pos.x+ancho/2;

          carta[i].x[1]=Tx-mouse.pos.x+ancho/2;
          carta[i].y[1]=Ty-mouse.pos.y;

          carta[i].x[2]=Tx-mouse.pos.y;
          carta[i].y[2]=mouse.pos.x-largo/2;
            }
         if(index == 2){
          carta[i].x[2]=mouse.pos.x-ancho/2;
          carta[i].y[2]=mouse.pos.y-largo/2;

          carta[i].x[3]=mouse.pos.y;
          carta[i].y[3]=Ty-mouse.pos.x+ancho/2;

          carta[i].x[0]=Tx-mouse.pos.x+ancho/2;
          carta[i].y[0]=Ty-mouse.pos.y;

          carta[i].x[1]=Tx-mouse.pos.y;
          carta[i].y[1]=mouse.pos.x-largo/2;
            }
         if(index == 1){
           carta[i].x[1]=mouse.pos.x-ancho/2;
           carta[i].y[1]=mouse.pos.y-largo/2;

           carta[i].x[2]=mouse.pos.y;
           carta[i].y[2]=Ty-mouse.pos.x+ancho/2;

           carta[i].x[3]=Tx-mouse.pos.x+ancho/2;
           carta[i].y[3]=Ty-mouse.pos.y;

           carta[i].x[0]=Tx-mouse.pos.y;
           carta[i].y[0]=mouse.pos.x-largo/2;
           }
         //  carta[i].x[2]=mouse.pos.x-ancho/2;
         //  carta[i].y[2]=Ty-(mouse.pos.y-largo/2);
         //   }
        }
       context.beginPath();
       context.fillStyle = "rgb(255,255,255)"
       context.fillRect (carta[i].x[index], carta[i].y[index], ancho, largo);
       context.fill();
       context.closePath();

      if((carta[i].up && carta[i].jugador.name == jugador[index].name)||carta[i].tirada==true){
      context.font = "12px Arial";
      if(carta[i].palo=="espadas")context.fillStyle = "#0095DD";
      if(carta[i].palo=="bastos")context.fillStyle = "#7D210E";
      if(carta[i].palo=="oros")context.fillStyle = " #E5CA3E";
      if(carta[i].palo=="copas")context.fillStyle = "#E5573E";
      context.fillText(carta[i].label, carta[i].x[index], carta[i].y[index]+12);
  //    if(carta[i].tirada==false){
    //    context.fillText(carta[i].jugador.name, carta[i].x[index], carta[i].y[index]+22);
    //  }
     context.font = "55px Arial";
     context.fillText(carta[i].n,carta[i].x[index]+10, carta[i].y[index]+80);
      }else{
        context.fillStyle = "grey";
        context.fillRect (carta[i].x[index], carta[i].y[index], ancho, largo);
        context.fillStyle = "LightGray";
        context.font = "12px Arial";
        context.fillText(carta[i].jugador.name, carta[i].x[index], carta[i].y[index]+22);
      }
      context.beginPath();

      if(carta[i].seleccionada){
        if((Math.pow(carta[i].x[index]-330,2)+(Math.pow(carta[i].y[index]-325,2)))>Math.pow(160,2)){
          context.strokeStyle = "blue";
        }else{
          context.strokeStyle = "red";}
      }else{
        if(carta[i].tirada) {
          context.strokeStyle = "green";
         }else{
            context.strokeStyle = "black";
         }
      }
      context.rect(carta[i].x[index], carta[i].y[index], ancho, largo);
      context.stroke();
      //context.fillText("carta "+i+" : "+parseInt(carta[i].x[index])+","+parseInt(carta[i].y[index]), 8,40+i*20);
     }
   }
   poner_mensaje();
 }

 //cargamos jugadores
 socket.on('jugador', function (data) {jugador=data.jugador });

	socket.on('escena', function (data) {
    carta=data.carta
    drawCartas();
   });

   function mainLoop() {
   if ((mouse.click && mouse.move)) {
      socket.emit('escena', {  carta : carta });
      }
      setTimeout(mainLoop, 25); //25ms
   }
   mainLoop();
});

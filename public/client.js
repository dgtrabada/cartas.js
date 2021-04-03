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
   var ancho = 133
   var largo = 204
   Tx=Ty=800
   var mensaje = "inicio de partida"

   var imagen=[];
   var back=new Image();
   back.src="B.png"
   var palo = ["oros","copas","bastos","espadas"]
   var num = ["2","4","5","6","7","S","C","R","3","1"]
   for (p=0;p<palo.length;p++){
     for (i=0;i<num.length;i++){
       var k = new Image();
       k.src = num[i]+"_"+palo[p]+".png" ;
       imagen.push(k);
     }
   }
/*
   var nombre =""
   var index = Math.floor(Math.random()*4)
   nombre=getName(index);
*/
   function getName(aux_index) {
   var aux_name=0
   if(aux_index==0) aux_name="dgtrabada"
   if(aux_index==1) aux_name="dguerra"
   if(aux_index==2) aux_name="pangard"
   if(aux_index==3) aux_name="alsubias"
   return aux_name
   }


   var index = 5;
   var nombre = prompt("Please enter your name:","");
   index=getIndex(nombre)

   socket.emit('loggin', {  nombre : nombre });

   function getIndex(n) {
     var aux_index=1
     if(n == "dgtrabada") aux_index=0
     if(n == "dguerra") aux_index=1
     if(n == "pangard") aux_index=2
     if(n == "alsubias") aux_index=3
     return aux_index
   }



   // register mouse event handlers
   canvas.onmousedown = function(e){
   mouse.click = true;
   mouse.pos.x = e.clientX ;
   mouse.pos.y = e.clientY ;
   for (i=carta.length-1;i>-1;i--) {
    if(carta[i].visible){
       if(mouse.pos.x>carta[i].x[index] && mouse.pos.x<(carta[i].x[index]+ancho) && mouse.pos.y>carta[i].y[index] && mouse.pos.y<(carta[i].y[index]+largo)){
         carta[i].seleccionada_por=nombre;
         i=-1 ;//carta.length
         }
       }
     }
     if(mouse.pos.x>(Tx+30) && mouse.pos.x<(Tx+60)){
     if( mouse.pos.y >(Ty-200) &&  mouse.pos.y <(Ty-200+25) ){
       repartir();
     }

     if( mouse.pos.y >(Ty-160) &&  mouse.pos.y <(Ty-160+25) ){
       cantar_renuncio();
     }

     if( mouse.pos.y >(Ty-120) &&  mouse.pos.y <(Ty-120+25) ){
       jugador[index].cantes=jugador[index].cantes+" 20"
       for (i=0;i<carta.length;i++) {
         if (carta[i].tirada){
            if(carta[i].n=="C"){
              jugador[index].cantes=jugador[index].cantes+" "+carta[i].palo
            }
         }
       }
       jugador[index].puntos+=20
       llevar_cartas();
     }
     if(mouse.pos.y >(Ty-80) &&  mouse.pos.y <(Ty-80+25)){
       jugador[index].puntos+=40
       jugador[index].cantes=jugador[index].cantes+" 40"
       for (i=0;i<carta.length;i++) {
         if (carta[i].tirada){
            if(carta[i].n=="R"){
              jugador[index].cantes=jugador[index].cantes+" "+carta[i].palo
            }
         }
       }
       llevar_cartas()
     }
     if(mouse.pos.y >(Ty-40) &&  mouse.pos.y <(Ty-40+25) ){
       llevar_cartas()
     }
   }
   }; // canvas.onmousedown

   canvas.onmouseup = function(e){
      mouse.click = false;
      for (i=0;i<carta.length;i++) {
        if(carta[i].seleccionada_por == nombre){
        if((Math.pow(carta[i].x[index]-330,2)+(Math.pow(carta[i].y[index]-325,2)))<Math.pow(160,2)){
          carta[i].tirada=true;
        }else{carta[i].tirada=false;}
        carta[i].seleccionada_por="nadie";
        }
      }
    //  socket.emit('jugador', {  jugador : jugador });
      socket.emit('escena', {  carta : carta });
      drawCartas()

    };

   canvas.ondblclick  = function(e){
     mouse.pos.x = e.clientX ;
     mouse.pos.y = e.clientY ;

     for (i=carta.length-1;i>-1;i--) {
      if(carta[i].visible){
         if(mouse.pos.x>carta[i].x[index] && mouse.pos.x<(carta[i].x[index]+ancho) && mouse.pos.y>carta[i].y[index] && mouse.pos.y<(carta[i].y[index]+largo)){
          carta[i].up=!(carta[i].up);
          i=-1
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

      for (j=0;j<jugador.length;j++) {
        jugador[j].puntos=0
        jugador[j].cantes=""
        if(jugador[j].name==nombre) {jugador[j].reparte=true;
        }else {jugador[j].reparte=false}
      }
      socket.emit('jugador', {  jugador : jugador });

      for(i=0;i<40;i++){
          carta[i].up=false;
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

          id=ip=ia=ig=0
          var sep=19
          for(i=0;i<40;i++) {
            //console.log(carta[i].jugador.name)
            if(carta[i].jugador.name=="dgtrabada"){
              carta[i].x=[ancho+sep/2 + Tx/sep*id,(Tx-ancho),         ancho+sep/2 + Tx/sep*id, 0                ]
              carta[i].y=[(Ty-largo),              largo/2+Ty/sep*id,                       0, largo/2+Ty/sep*id]
              id++;
              }
            if(carta[i].jugador.name=="dguerra"){
              carta[i].x=[0,                 ancho+sep/2 + Tx/sep*ig,  (Tx-ancho),       ancho+sep/2 + Tx/sep*ig]
              carta[i].y=[largo/2+Ty/sep*ig, (Ty-largo),               largo/2+Ty/sep*ig,                      0]
              ig++;
              }
            if(carta[i].jugador.name=="pangard"){
              carta[i].x=[ancho+sep/2 + Tx/sep*ip, 0,               ancho+sep/2 + Tx/sep*ip,  (Tx-ancho)]
              carta[i].y=[0,                     largo/2+Ty/sep*ip, (Ty-largo),                largo/2+Ty/sep*ip]
             ip++;
             }
           if(carta[i].jugador.name=="alsubias"){
             carta[i].x=[Tx-ancho,          ancho+sep/2 + Tx/sep*ia, 0,                 ancho+sep/2 + Tx/sep*ia]
             carta[i].y=[largo/2+Ty/sep*ia,  0,                     largo/2+Ty/sep*ia,   (Ty-largo)]
              ia++;
             }
          }
          for(i=0;i<40;i++){
            images[i].src=carta[i].n+"_"+carta[i].palo+".png" ;
          }
      socket.emit('escena', {  carta : carta });

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
    if(jugador[j].reparte){mensaje=mensaje+'*'}
    mensaje=mensaje+jugador[j].name+" "+jugador[j].puntos
    mensaje=mensaje+jugador[j].cantes
    mensaje=mensaje+"; "//+imagen.length
 }
}


 function botones(){

   context.fillStyle = "MediumSeaGreen"
   if(mouse.pos.x>(Tx+30) && mouse.pos.x<(Tx+60) && mouse.pos.y >(Ty-200) &&  mouse.pos.y <(Ty-200+25) ){context.fillStyle = "greenyellow"}
   context.beginPath();
   context.fillRect (Tx+30, Ty-200,25,25);
   context.fill();
   context.closePath();
   context.stroke();
   context.fillStyle = "MediumSeaGreen"
   if(mouse.pos.x>(Tx+30) && mouse.pos.x<(Tx+60) && mouse.pos.y >(Ty-160) &&  mouse.pos.y <(Ty-160+25) ){context.fillStyle = "greenyellow"}
   context.beginPath();
   context.fillRect (Tx+30, Ty-160,25,25);
   context.fill();
   context.closePath();
   context.stroke();
   context.fillStyle = "MediumSeaGreen"
   if(mouse.pos.x>(Tx+30) && mouse.pos.x<(Tx+60) && mouse.pos.y >(Ty-120) &&  mouse.pos.y <(Ty-120+25) ){context.fillStyle = "greenyellow"}
   context.beginPath();
   context.fillRect  (Tx+30, Ty-120,25,25);
   context.fill();
   context.closePath();
   context.stroke();
   context.fillStyle = "MediumSeaGreen"
   if(mouse.pos.x>(Tx+30) && mouse.pos.x<(Tx+60) && mouse.pos.y >(Ty-80) &&  mouse.pos.y <(Ty-80+25) ){context.fillStyle = "greenyellow"}
   context.beginPath();
   context.fillRect (Tx+30, Ty-80,25,25);
   context.fill();
   context.closePath();
   context.stroke();
   context.fillStyle = "MediumSeaGreen"
   if(mouse.pos.x>(Tx+30) && mouse.pos.x<(Tx+60) && mouse.pos.y >(Ty-40) &&  mouse.pos.y <(Ty-40+25) ){context.fillStyle = "greenyellow"}
   context.beginPath();
   context.fillRect  (Tx+30, Ty-40,25,25);
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
      context.fillRect (0, 0, Tx, Ty);
      context.fill();
      context.closePath();
      context.beginPath();
      context.arc(Tx/2, Ty/2, (Tx+Ty)/8, 0, 2 * Math.PI, false);
      context.fillStyle = 'MediumSeaGreen';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#003300';
      context.stroke();

      botones();
      context.font = "14px Arial";
      context.fillStyle = "#0095DD";
      context.fillText("Repartir",Tx+60,Ty-200+20);
      context.fillText("Renuncio",Tx+60,Ty-160+20);
      context.fillText("Cantar 20",Tx+60,Ty-120+20);
      context.fillText("Cantar 40",Tx+60,Ty-80+20);
      context.fillText("Llevar cartas",Tx+60,Ty-40+20);
      context.fillStyle = "black"
      context.fillText(jugador[index].name,      Tx/2-20,Ty/2+160-14);
      context.fillText(jugador[(index+3)%4].name,Tx/2-80+160,Ty/2);
      context.fillText(jugador[(index+2)%4].name,Tx/2-20,Ty/2-160+14);
      context.fillText(jugador[(index+1)%4].name,Tx/2-150,Ty/2);
 }

 function roundedRect(x, y, width, height, radius) {
   context.beginPath();
   context.lineWidth = 2;
   context.moveTo(x, y + radius);
   context.lineTo(x, y + height - radius);
   context.arcTo(x, y + height, x + radius, y + height, radius);
   context.lineTo(x + width - radius, y + height);
   context.arcTo(x + width, y + height, x + width, y + height-radius, radius);
   context.lineTo(x + width, y + radius);
   context.arcTo(x + width, y, x + width - radius, y, radius);
   context.lineTo(x + radius, y);
   context.arcTo(x, y, x, y + radius, radius);
   context.stroke();
 }


 function drawCartas(){

   borrar()
   context.lineWidth = 1;
   //context.fillText("name = "+jugador[index].name,Tx+30,390);
   //context.fillText("("+parseInt(mouse.pos.x)+","+parseInt(mouse.pos.y)+")", 8,20);
   context.font = "16px Arial";
   context.fillStyle = "#0095DD";
   poner_mensaje();
   context.fillText(mensaje,20,Ty+20);

   for (i=0;i<carta.length;i++) {
   if(carta[i].visible){
       if(carta[i].seleccionada_por == nombre && mouse.click ){
         if(index == 0){
           carta[i].x[0]=mouse.pos.x-ancho/2;
           carta[i].y[0]=mouse.pos.y-largo/2;
           carta[i].x[1]=mouse.pos.y-ancho/2;
           carta[i].y[1]=Ty-mouse.pos.x-largo/2;
           carta[i].x[2]=Tx-mouse.pos.x-ancho/2;
           carta[i].y[2]=Ty-mouse.pos.y-largo/2;
           carta[i].x[3]=Tx-mouse.pos.y-ancho/2;
           carta[i].y[3]=mouse.pos.x-largo/2;
        }
         if(index == 3){
           carta[i].x[3]=mouse.pos.x-ancho/2;
           carta[i].y[3]=mouse.pos.y-largo/2;
           carta[i].x[0]=mouse.pos.y-ancho/2;
           carta[i].y[0]=Ty-mouse.pos.x-largo/2;
           carta[i].x[1]=Tx-mouse.pos.x-ancho/2;
           carta[i].y[1]=Ty-mouse.pos.y-largo/2;
           carta[i].x[2]=Tx-mouse.pos.y-ancho/2;
           carta[i].y[2]=mouse.pos.x-largo/2;
            }
         if(index == 2){
           carta[i].x[2]=mouse.pos.x-ancho/2;
           carta[i].y[2]=mouse.pos.y-largo/2;
           carta[i].x[3]=mouse.pos.y-ancho/2;
           carta[i].y[3]=Ty-mouse.pos.x-largo/2;
           carta[i].x[0]=Tx-mouse.pos.x-ancho/2;
           carta[i].y[0]=Ty-mouse.pos.y-largo/2;
           carta[i].x[1]=Tx-mouse.pos.y-ancho/2;
           carta[i].y[1]=mouse.pos.x-largo/2;
            }
         if(index == 1){
           carta[i].x[1]=mouse.pos.x-ancho/2;
           carta[i].y[1]=mouse.pos.y-largo/2;
           carta[i].x[2]=mouse.pos.y-ancho/2;
           carta[i].y[2]=Ty-mouse.pos.x-largo/2;
           carta[i].x[3]=Tx-mouse.pos.x-ancho/2;
           carta[i].y[3]=Ty-mouse.pos.y-largo/2;
           carta[i].x[0]=Tx-mouse.pos.y-ancho/2;
           carta[i].y[0]=mouse.pos.x-largo/2;
           }

         //  carta[i].x[2]=mouse.pos.x-ancho/2;
         //  carta[i].y[2]=Ty-(mouse.pos.y-largo/2);
         //   }
        }
       context.beginPath();
       /*
       context.fillStyle = "rgb(255,255,255)"
       context.fillRect (carta[i].x[index], carta[i].y[index], ancho, largo);
       context.fill();
       context.closePath();
*/
      if((carta[i].up ^ carta[i].jugador.name == jugador[index].name) || carta[i].tirada==true){
      /*
      context.font = "12px Arial";
      if(carta[i].palo=="espadas")context.fillStyle = "#0095DD";
      if(carta[i].palo=="bastos")context.fillStyle = "#7D210E";
      if(carta[i].palo=="oros")context.fillStyle = " #E5CA3E";
      if(carta[i].palo=="copas")context.fillStyle = "#E5573E";
      context.fillText(carta[i].label, carta[i].x[index], carta[i].y[index]+12);
      context.font = "55px Arial";
      context.fillText(carta[i].n,carta[i].x[index]+10, carta[i].y[index]+80);
      */
      context.drawImage(imagen[carta[i].id], carta[i].x[index], carta[i].y[index]);
      }else{
        /*
        context.fillStyle = "grey";
        context.fillRect (carta[i].x[index], carta[i].y[index], ancho, largo);
        context.fillStyle = "LightGray";
        context.font = "12px Arial";
        context.fillText(carta[i].jugador.name, carta[i].x[index], carta[i].y[index]+22);
        */
        context.drawImage(back, carta[i].x[index], carta[i].y[index]);


      }
      context.beginPath();

      if(carta[i].seleccionada_por != "nadie"){
        if((Math.pow(carta[i].x[index]-330,2)+(Math.pow(carta[i].y[index]-325,2)))<Math.pow(160,2)){
          context.strokeStyle = "red";
          roundedRect(carta[i].x[index], carta[i].y[index], ancho, largo,10);
        }else{
          context.strokeStyle = jugador[(getIndex(carta[i].seleccionada_por))].color;
          roundedRect(carta[i].x[index], carta[i].y[index], ancho, largo,10);
        }
      }else{
        if(carta[i].tirada) {
          context.strokeStyle = "greenyellow";
          roundedRect(carta[i].x[index], carta[i].y[index], ancho, largo,10);
        }//else{
        //    context.strokeStyle = "black";
        // }
      }
  //    context.rect(carta[i].x[index], carta[i].y[index], ancho, largo);
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
      setTimeout(mainLoop, 50); //Xms
   }
   mainLoop();
});

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
   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;
   var ancho = 60
   var largo = 100
   var Tx = 400
   var Ty = 400


   var name = "dgtrabada";
   var index = Math.floor(Math.random()*4)
   if(index == 0 )  name = "dgtrabada";
   if(index == 1 )  name = "alsubias";
   if(index == 2 )  name = "pangard";
   if(index == 3)  name = "dguerra";

   /*
   name=prompt("Please enter your name:", name);
   if (name == null || name == "") {
     txt = "User cancelled the prompt.";
   } else {
     txt = "Hello " + name + "! How are you today?";
   }
   */
   socket.emit('name', {  name : name });
   // register mouse event handlers
   canvas.onmousedown = function(e){
   mouse.click = true;
   mouse.pos.x = e.clientX ;
   mouse.pos.y = e.clientY ;
   for (i=0;i<carta.length;i++) {
     if(mouse.pos.x>carta[i].x[index] && mouse.pos.x<(carta[i].x[index]+ancho) && mouse.pos.y>carta[i].y[index] && mouse.pos.y<(carta[i].y[index]+largo)){
       carta[i].seleccionada=true;
       i=carta.length
       }
     }
    };
   canvas.onmouseup = function(e){
      mouse.click = false;
      for (i=0;i<carta.length;i++) {
        carta[i].seleccionada=false;
      }
      socket.emit('escena', {  carta : carta });
      drawCartas()
    };

   canvas.ondblclick  = function(e){
     mouse.pos.x = e.clientX ;
     mouse.pos.y = e.clientY ;
     for (i=0;i<carta.length;i++) {
       if(mouse.pos.x>carta[i].x[index] && mouse.pos.x<(carta[i].x[index]+ancho) && mouse.pos.y>carta[i].y[index] && mouse.pos.y<(carta[i].y[index]+largo)){
         carta[i].up=!(carta[i].up);

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
   };

 function borrar(){
      context.beginPath();
      context.fillStyle = "rgb(255,255,255)"
      context.fillRect (0, 0, canvas.width, canvas.height);
      context.fill();
      context.closePath();
 }

 function drawCartas(){

   borrar()
   context.font = "16px Arial";
   context.fillStyle = "#0095DD";
   context.fillText("("+parseInt(mouse.pos.x)+","+parseInt(mouse.pos.y)+")", 8,20);
   context.font = "12px Arial";
   context.fillStyle = "#0095DD";
   context.fillText("name = "+name,8,40);

   for (i=0;i<carta.length;i++) {
     if(carta[i].seleccionada && mouse.click ){
    //   carta[i].x[index]=mouse.pos.x-ancho/2;
    //   carta[i].y[index]=mouse.pos.y-largo/2;
//if(index == 0){
    //   aux_x=[(mouse.pos.x-ancho/2),(mouse.pos.y-largo/2),(Tx-mouse.pos.x-ancho/2),(Tx-mouse.pos.y-largo/2)];
//carta[i].x=aux_x;
    //   aux_y=[(mouse.pos.y-largo/2),(mouse.pos.x-ancho/2),(Ty-mouse.pos.y-largo/2),(Ty-mouse.pos.x-ancho/2)];
    //   carta[i].y=aux_y;
    if(index == 0){
          carta[i].x[0]=mouse.pos.x-ancho/2;
          carta[i].y[0]=mouse.pos.y-largo/2;
          carta[i].x[1]=mouse.pos.y-largo/2;
          carta[i].y[1]=mouse.pos.x-ancho/2;
          carta[i].x[2]=mouse.pos.x-ancho/2;
          carta[i].y[2]=Ty+largo*3/2-mouse.pos.y-largo/2;
          carta[i].x[3]=mouse.pos.y-largo/2;
          carta[i].y[3]=mouse.pos.x-ancho/2;
        }
        if(index == 1){
              carta[i].x[0]=mouse.pos.x-ancho/2;
              carta[i].y[0]=mouse.pos.y-largo/2;
              carta[i].x[2]=mouse.pos.x-ancho/2;
              carta[i].y[2]=Ty+largo*3/2-mouse.pos.y-largo/2;
            }
        if(index == 2){
              carta[i].x[0]=mouse.pos.x-ancho/2;
              carta[i].y[0]=Ty+largo*3/2-mouse.pos.y-largo/2;
              carta[i].x[2]=mouse.pos.x-ancho/2;
              carta[i].y[2]=mouse.pos.y-largo/2;
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

    if(carta[i].up && carta[i].jugador.name == name){
      context.font = "12px Arial";
      if(carta[i].palo=="espadas")context.fillStyle = "#0095DD";
      if(carta[i].palo=="bastos")context.fillStyle = "#7D210E";
      if(carta[i].palo=="oros")context.fillStyle = " #E5CA3E";
      if(carta[i].palo=="copas")context.fillStyle = "#E5573E";
      context.fillText(carta[i].label, carta[i].x[index], carta[i].y[index]+12);
      context.fillText(carta[i].jugador.name, carta[i].x[index], carta[i].y[index]+22);
      context.font = "55px Arial";
      context.fillText(carta[i].n,carta[i].x[index]+10, carta[i].y[index]+80);
    }else{
      context.fillStyle = "#787274";
      context.fillRect (carta[i].x[index], carta[i].y[index], ancho, largo);
      context.fillStyle = "yellow";
      context.font = "12px Arial";
      context.fillText(carta[i].jugador.name, carta[i].x[index], carta[i].y[index]+22);
    }
      context.beginPath();
      if(carta[i].seleccionada){
        context.strokeStyle = "red";
      }else{
        context.strokeStyle = "black";}
        context.rect(carta[i].x[index], carta[i].y[index], ancho, largo);
        context.stroke();
      //context.fillText("carta "+i+" : "+parseInt(carta[i].x[index])+","+parseInt(carta[i].y[index]), 8,40+i*20);
     }


 }

	socket.on('escena', function (data) {
    carta=data.carta
    for(var i=0; i<data.carta.length;i++){carta[i]=data.carta[i];}
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

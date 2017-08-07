var generar = document.getElementById('ejecutar');
var solucion = document.getElementById('solucion');
var pasito = document.getElementById('pasito');
var tablero = document.getElementById('tablero');
/*Creamos 3 varibles nuevas */
/*La primera variable  que almacenara el numero de celdas*/
var numeroC;
/*La segunda variable que almacenará nuestro array*/
var respuesta =[];
/*La tercera variable que almacenará nuestro paso actual en el juego*/
var actual =0;


function check (i, j, n) {
   if (  i >= 0 && j >= 0 && i < n && j < n)
       return true;
   return false;   
}

function randInt (n) {
   return Math.floor(Math.random () * n);
}

function gen_heuristic (n){  
  var M = initMatrix (n);
  var p = 1;
  while (p <= n / 2 + 1 ) {
    for (var i = p-1; i <= n - p; i++){
      M[p - 1][i] = p;
      M[i][p - 1] = p;
      M[i][n - p] = p;
      M[n - p][i] = p;
    }
    p++;    
  }
  M[0][0] = 0;
  M[0][n - 1] = 0;
  M[n - 1][0] = 0;
  M[n - 1][n - 1] = 0;
  return M;
}


function shuffleArray(d) {
  for (var c = d.length - 1; c > 0; c--) {
    var b = Math.floor(Math.random() * (c + 1));
    var a = d[c];
    d[c] = d[b];
    d[b] = a;
  }
  return d
};

function use_helper (soluciones, helper) {
   var pos = -1;
   var min = 10000;
   soluciones = shuffleArray (soluciones);
   for (var i = 0; i < soluciones.length; i++) {
      var x = soluciones[i].x;
      var y = soluciones[i].y;      
      if ( helper[x][y] < min) {
         min = helper[x][y] ;
         pos = i;
      }
   }
   return pos;
}

function gen_solution (M, helper, n) {
    var mov_x = [-2, -1, +1, +2, +2, +1, -1, -2];
    var mov_y = [-1, -2, -2, -1, +1, +2, +2, +1];    
    var step = 1;
    var x = 0; var y = 0;
    
     var inicioRandom = [{x:0,y:0},{x:0,y:n-1},{x:n-1,y:0},{x:n-1,y:n-1}];
    var inicio = inicioRandom[Math.floor(Math.random ()* 4)];
    var x = inicio.x;
    var y = inicio.y;

    
    M[x][y] = step;
    while ( true ) {
        if ( step == n * n) {
            console.log ('eureka!!!');
            return true;
        }
        var soluciones = [];
        for (var index = 0; index < mov_x.length; index++) {
            var i = x + mov_x[index];
            var j = y + mov_y[index];   
            if (check (i, j, n) && M [i][j] == 0) {
               soluciones.push ( {x:i, y:j});
            }
        }
        if (soluciones.length == 0) {
           console.log ("fail!!");
           break;
        }
        var idx = use_helper (soluciones, helper) ;
        x =  soluciones[ idx ].x;
        y =  soluciones[ idx ].y;
        step++;
        M[x][y] = step;
       //console.log ("step: " + step);
       
    }
    return false;
} 


function initMatrix (n) {
    var matrix = [];
    for (var i = 0; i < n; i++) {
        var fila = [];
        for (var j = 0; j < n; j++) {
            fila[j] = 0;
        }
        matrix[i] = fila;
    }
    return matrix;
}

generar.onclick = function () {
    actual=0;
    respuesta=[];
    tablero.innerHTML = '';
    var n = parseInt(document.getElementById('lados').value);
    
     if(lados.value.length == ""){ 
      alert("Debes ingresar un numero");
     }
    else{
    
    for( var i = 0; i < 1000; i++) {
        var M = initMatrix (n);
        var helper = gen_heuristic (n);
        if (gen_solution (M, helper, n) ) {
            break;
        }
    }
    
    var tabla = document.createElement('table');
    tabla.border = "1";
    for (var i = 0; i < n; i++) {
        var fila = document.createElement('tr');
        for (var j = 0; j < n; j++) {
            var celda = document.createElement('td');
            if (i % 2 == 0 && j % 2 != 0 || i % 2 != 0 && j % 2 == 0) {
                celda.setAttribute('class', 'negro');
            }
            /*var p = document.createElement('p');
            p.innerHTML = M[i][j];
            celda.appendChild(p);*/
            
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }
    tablero.appendChild(tabla);
  }
}

solucion.onclick = function(){
    
    tablero.innerHTML = '';
    var n = parseInt(document.getElementById('lados').value);
    
    for( var i = 0; i < 1000; i++) {
        var M = initMatrix (n);
        var helper = gen_heuristic (n);
        if (gen_solution (M, helper, n) ) {
            break;
        }
     }
    
    var tabla = document.createElement('table');
    tabla.border = "1";
    for (var i = 0; i < n; i++) {
        var fila = document.createElement('tr');
        for (var j = 0; j < n; j++) {
            var celda = document.createElement('td');
            if (i % 2 == 0 && j % 2 != 0 || i % 2 != 0 && j % 2 == 0) {
                celda.setAttribute('class', 'negro');
            }
            var p = document.createElement('p');
            p.innerHTML = M[i][j];
            celda.appendChild(p);
            
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }
    tablero.appendChild(tabla);
    ordenarArray();
}

function ordenarArray(){
/*utilizaremos el metodo sort para ordenar los elementos de nuestro array*/
respuesta = respuesta.sort(function(a, b){
/* Retornamos y utilizamos la propiedad textContent porque esta propiedad en un nodo elimina todos sus hijos y los reemplaza con un solo nodo de texto con el valor dado.*/
return a.textContent - b.textContent;
  });
}
    
pasito.onclick = function () {
    if (actual == numeroC*numeroC){
        alert("Fin del Juego!");
        actual= 0;
        respuesta = [];
        return;
    }
    
    if(actual<(numeroC*numeroC)){
    /*Utilizamos esta propiedad del setatributte porque agrega un nuevo atributo o cambia el valor de un atributo en un elemento especificado. "pasito" es el valor deseado para el atributo*/
    respuesta[actual].setAttribute("class",  "pasito");
    actual++;
    }
}


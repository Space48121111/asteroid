const canvas = document.querySelector('#canvas');

// if (!canvas.getContext()) {
//   return;
// }

const ctx = canvas.getContext('2d');

var playerX = canvas.width/2;
var playerY = canvas.height/2;

// radius
var playerRadius = 100;

// velocity
var playerVelocity = 50;

// angle
var playerAngle = 30;

// four corners from top left clockwise rotate
var xAxis = [-5, 5, 10, -10];
// y increases as going down the axis
var yAxis = [-10, -10, 10, 10];


var isUpPressed = false;
var isDownPressed = false;
var isLeftPressed = false;
var isRightPressed = false;

var revolutionSpeed = 5;

var engineX = [-5, 5];
var engineY = [17, 17];

// player1 vs player2 arrow computer
function drawSpaceship() {

  // var path = new Path('2D');

  // 1 radian: one arc length equals to radius
  var radian = (Math.PI/180)*playerAngle;
  var cos = Math.cos(radian);
  var sin = Math.sin(radian);

  for (var i=0; i<4; i++) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.beginPath();

    // iterate thru all pts
    // var cx = pX+xAxis[i];
    // var cy = pY+yAxis[i];

    // var xAxis = [-5, 5, 10, -10];
    // var yAxis = [-10, -10, 10, 10];
    // rotate the spaceship projecting to x-axis
    // then move along the y axis by distance y

    // cx rotation center
    var cx = playerX+(cos*xAxis[i])+(sin*yAxis[i]);
    // y axis value becomes higher as you go down
    var cy = playerY+(cos*yAxis[i])-(sin*xAxis[i]);
    // console.log('i '+i+' '+xAxis[i]+' '+yAxis[i]+' cx '+parseInt(cx-pX)+' cy '+parseInt(cy-pY));

    // next/new pt
    // var nX = pX+xAxis[(i+1)%4]; // 0 1 2 3
    // var nY = pY+yAxis[(i+1)%4];

    var j = (i+1)%4
    var nX = playerX+(cos*xAxis[j])+(sin*yAxis[j]); // 0 1 2 3
    var nY = playerY+(cos*yAxis[j])-(sin*xAxis[j]);


    ctx.moveTo(cx, cy);
    ctx.lineTo(nX, nY);
    // ctx.fill();
    ctx.stroke();

  }

  for (var i=0; i<2; i++) {
    ctx.lineWidth = 1;
    ctx.fillStyle = 'orange';
    ctx.beginPath();

    var cx = playerX+(cos*engineX[i])+(sin*engineY[i]);
    var cy = playerY+(cos*engineY[i])-(sin*engineX[i]);

    // ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)
    ctx.ellipse(cx, cy, 4, 8, -radian, 0, Math.PI*2);
    ctx.fill();

  }

  // ctx.end;

}


function drawAsteroid() {

}



function draw() {
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();

  drawSpaceship();

}

function frame() {
  if (isRightPressed) {
    playerAngle += revolutionSpeed;
  } else if (isLeftPressed) {
    playerAngle -= revolutionSpeed;
  }

  draw();
}

document.addEventListener('keydown', (event) => {
  if (event.key === "w") {
    console.log('isUpPressed');
    isUpPressed = true;
  }
  else if (event.key === "a") {
    console.log('isLeftPressed');
    isLeftPressed = true;
  }
  else if (event.key === "s") {
    console.log('isDownPressed');
    isDownPressed = true;
  }
  else if (event.key === "d") {
    console.log('isRightPressed');
    isRightPressed = true;
  }
}, false);

// detect how long the key is being pressed down
document.addEventListener('keyup', (event) => {
  if (event.key === "w") {
    console.log('isUpPressed');
    isUpPressed = false;
  }
  else if (event.key === "a") {
    console.log('isLeftPressed');
    isLeftPressed = false;
  }
  else if (event.key === "s") {
    console.log('isDownPressed');
    isDownPressed = false;
  }
  else if (event.key === "d") {
    console.log('isRightPressed');
    isRightPressed = false;
  }
}, false);


setInterval(function(){frame()}, 100);

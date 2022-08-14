var abc = 1;
const canvas = document.querySelector('#canvas');
// if (!canvas.getContext()) {
//   return;
// }
const ctx = canvas.getContext('2d');
var shipX = canvas.width/2;
var shipY = canvas.height/2;
var shipRadius = 10;
var shipAngle = 30;
// four points
var xAxis = [-5, 5, 10, -10];
var yAxis = [-10, -10, 10, 10];
var isUpPressed = false;
var isDownPressed = false;
var isLeftPressed = false;
var isRightPressed = false;
var revolutionSpeed = 0.25;
var engineX = [-5, 5];
var engineY = [17, 17];
var time = 0;
var speedX = 0;
var speedY = 0;
var deAcceleration = 0.8;
var maxSpeed = 100;
var acceleration = 5;
var laserX = [];
var laserY = [];
var laserAngle = [];
var laserVelocity = 10;
var laserLength = 5;
var isSpacePressed = false;
var laserFreq = 2;
var laserTimer = 0
var asteroids = [];
var asteroidRadiusMin = 8;
var asteroidRadiusMax = 10;
var asteroidsNum = 18;
var asteroidRotationSpeed = 3;
var asteroidMovingSpeed = 0.5;
// new asteroid spawning
var wanderingStarsDelay = 20;
var cometsTimer = 0;
var trackingRecord = 0;

function rotateShipCorner(i, sin, cos) {
  // rotation matrix in cartesian coordinate system
  var cx = shipX+cos*xAxis[i]+sin*yAxis[i];
  var cy = shipY+cos*yAxis[i]-sin*xAxis[i];
  return [cx, cy];
}

// player1 vs #todo player2-->arrow-shaped AI
function drawSpaceship() {
  // 1 radian: one arc length equals to radius
  var radian = (Math.PI/180)*shipAngle;
  var sin = Math.sin(radian);
  var cos = Math.cos(radian);
  ctx.lineWidth = 1;
  ctx.fillStyle = 'white';
  ctx.beginPath();
  var path=new Path2D();
  var cPos=rotateShipCorner(xAxis.length-1, sin, cos);
  path.moveTo(cPos[0], cPos[1]);
  // i iterate thru 0 -> 3
  for (var i=0; i<xAxis.length; i++) {
    // next/new pt
    // var j = (i+1)%4
    // var nX = shipX+(cos*xAxis[j])+(sin*yAxis[j]); // 0 1 2 3
    // var nY = shipY+(cos*yAxis[j])-(sin*xAxis[j]);
    // ctx.moveTo(cx, cy);
    // ctx.lineTo(nX, nY);
    // ctx.stroke();
    var nPos = rotateShipCorner(i, sin, cos);
    path.lineTo(nPos[0], nPos[1]);
  }
  ctx.fill(path);

  var timeOffset = time*2;
  // sin oscillating wave 0-1
  var alpha = (1+Math.sin(timeOffset))*0.5;
  var yRadius = 2+alpha*4;
  for (var i=0; i<2; i++) {
    ctx.lineWidth = 1;
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    var dynamicY = engineY[i]+yRadius-6;
    var cx = shipX+cos*engineX[i]+sin*dynamicY;
    var cy = shipY+cos*dynamicY-sin*engineX[i];
    // ellipse(x, y, xRadius, yRadius, rotation, startAngle, endAngle);
    ctx.ellipse(cx, cy, 4, yRadius, -radian, 0, Math.PI*2);
    ctx.fill();
  }
}


function drawLaser() {
  for (var i=0; i < laserX.length; i++){
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(laserX[i], laserY[i]);
    var radian = (Math.PI/180)*laserAngle[i];
    var cx = laserX[i] + Math.cos(radian)*laserLength;
    var cy = laserY[i] - Math.sin(radian)*laserLength;
    ctx.lineTo(cx, cy);
    ctx.stroke();
  }
}

function drawTrackingRecord() {
  ctx.fillStyle = 'gold';
  ctx.lineWidth = 1;
  ctx.font = '20px verdana';
  ctx.fillText('Tracking Record: '+ trackingRecord, 20, 30);
}

function rotateAsteroidCorner(i, j, sin, cos) {
  // rotation matrix in cartesian coordinate system
  var cx = asteroids[i].asteroidX+cos*asteroids[i].pointsX[j]+sin*asteroids[i].pointsY[j];
  var cy = asteroids[i].asteroidY+cos*asteroids[i].pointsY[j]-sin*asteroids[i].pointsX[j];
  return [cx, cy];
}
function drawAsteroids() {
  for (i=0; i<asteroids.length; i++) {
    var radian = (Math.PI/180)*asteroids[i].asteroidAngle;
    var sin = Math.sin(radian);
    var cos = Math.cos(radian);
    ctx.lineWidth = 1;
    ctx.fillStyle = '#a1936f';
    ctx.beginPath();
    var path=new Path2D();
    var cPos=rotateAsteroidCorner(i, asteroids[i].pointsX.length-1, sin, cos);
    path.moveTo(cPos[0], cPos[1]);
    for (var j=0; j<asteroids[i].pointsX.length; j++) {
      var nPos = rotateAsteroidCorner(i, j, sin, cos);
      path.lineTo(nPos[0], nPos[1]);
    }
    ctx.fill(path);
  }

}

function draw() {
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  drawSpaceship();
  drawLaser();
  drawAsteroids();
  drawTrackingRecord();
}
// to make it smooth for each frame
// the less the distance, the slower it goes
function interpolate(current, target, speed) {
  var distance = target - current;
  if (Math.abs(distance) < 0.0001) {
    return target;
  }
  return current + distance*Math.min(1, speed);
}

function updateRotation() {
  // if (isRightPressed) {
  //   shipAngle += revolutionSpeed;
  // } else if (isLeftPressed) {
  //   shipAngle -= revolutionSpeed;
  // }
  var targetAngle = shipAngle;
  if (speedX != 0 || speedY != 0) {
    targetAngle = (Math.atan2(-speedY, speedX)/Math.PI)*180;
    targetAngle += -90;
  }
  // -180-180 to take the shortest path
  var diff = targetAngle - shipAngle;
  while (diff > 180) {
    diff -= 360;
  }
  while (diff < -180) {
    diff += 360;
  }
  shipAngle = interpolate(shipAngle, shipAngle+diff, revolutionSpeed);
}

function clamp(val, min, max) {
  if (val < min) {
    return min;
  }
  if (val > max) {
    return max;
  }
  return val;
}

function updateMovement() {
  var moveX = 0;
  var moveY = 0;
  if (isUpPressed) {
    moveY = -1;
  } else if (isDownPressed) {
    moveY = 1;
  }
  if (isRightPressed) {
    moveX = 1;
  } else if (isLeftPressed) {
    moveX = -1;
  }
  // break first then turn
  speedX *= deAcceleration;
  speedY *= deAcceleration;
  speedX += moveX * acceleration;
  speedY += moveY * acceleration;
  speedX = clamp(speedX, -maxSpeed, maxSpeed);
  speedY = clamp(speedY, -maxSpeed, maxSpeed);

  shipX += speedX;
  shipY += speedY;
  // edges
  if (shipX < shipRadius) {
    shipX = shipRadius;
    speedX = 0;
  } else if (shipX > canvas.width-shipRadius) {
    shipX = canvas.width - shipRadius;
    speedX = 0;
  }

  if (shipY < shipRadius) {
    shipY = shipRadius;
    speedY = 0;
  } else if (shipY > canvas.height-shipRadius) {
    shipY = canvas.height - shipRadius;
    speedY = 0;
  }
}

function updateLaser() {
  if (isSpacePressed) {
    if (laserTimer > 0) {
      laserTimer -= 1;
    } else {
      // spawn the next laser
      laserTimer = laserFreq;
      laserX.push(shipX);
      laserY.push(shipY);
      laserAngle.push(shipAngle+90);
    }
  }
  for (var i=laserX.length-1; i>=0; i--) {
    var radian = (Math.PI/180)*laserAngle[i];
    var moveX = Math.cos(radian)*laserVelocity;
    var moveY = -Math.sin(radian)*laserVelocity;
    laserX[i] += moveX;
    laserY[i] += moveY;
    if (laserX[i]<0 || laserX[i]>canvas.width || laserY[i]<0 || laserY[i]>canvas.height) {
      laserX.splice(i, 1);
      laserY.splice(i, 1);
      laserAngle.splice(i, 1);
    }
  }
  // console.log(laserX.length);
}

function handleExplosion() {
  for (var i=asteroids.length-1; i>=0; i--) {
    var shouldExplode = false;
    for (var j=laserX.length-1; j>=0; j--) {
      if (laserX[j]<asteroids[i].asteroidX+asteroidRadiusMax &&
      laserX[j]>asteroids[i].asteroidX-asteroidRadiusMax &&
      laserY[j]<asteroids[i].asteroidY+asteroidRadiusMax &&
      laserY[j]>asteroids[i].asteroidY-asteroidRadiusMax) {
        shouldExplode = true;
        laserX.splice(j, 1);
        laserY.splice(j, 1);
        laserAngle.splice(j, 1);
      }
    }
    if (shouldExplode) {
      asteroids.splice(i, 1);
      trackingRecord += 1;
    }
  }
}

function spawnAsteroid(x, y, velocityX, velocityY) {
  var randomizepoints = parseInt(5+Math.random()*3);
  var pointsX = [];
  var pointsY = [];
  var multiplier = 1;

  if ((randomizepoints % 2) == 1 && Math.random() < 0.95) {
    multiplier = 2;
  }

  for (var i=0; i<randomizepoints; i++) {
    var asteroidCenterAngle = (360/randomizepoints)*i;
    var asteroidVertex = asteroidRadiusMin + Math.random()*(asteroidRadiusMax-asteroidRadiusMin);
    var radian = (Math.PI/180)*asteroidCenterAngle;
    pointsX.push(Math.cos(radian*multiplier)*asteroidVertex);
    pointsY.push(-Math.sin(radian*multiplier)*asteroidVertex);
  }
  var asteroidAngle = Math.random()*360;
  var asteroid = {
			asteroidX: x,
			asteroidY: y,
      asteroidAngle: asteroidAngle,
      pointsX: pointsX,
      pointsY: pointsY,
      velocityX: velocityX,
      velocityY: velocityY
		}
  asteroids.push(asteroid);
}

function initializeAsteriods() {
  for (var i=0; i<asteroidsNum; i++) {
    var asteroidX = Math.random()*canvas.width;
    var asteroidY = Math.random()*canvas.height;
    var asteroidsDirection = Math.random()*2*Math.PI;
    var velocityX = Math.cos(asteroidsDirection)*asteroidMovingSpeed;
    var velocityY = Math.sin(asteroidsDirection)*asteroidMovingSpeed;
    spawnAsteroid(asteroidX, asteroidY, velocityX, velocityY);
  }
}

initializeAsteriods();

function comingInVector(meteorX, meteorY) {
  var rdmPosX = canvas.width*0.2 + Math.random()*canvas.width*0.6;
  var rdmPosY = canvas.height*0.2 + Math.random()*canvas.height*0.6;
  var vectorX = rdmPosX - meteorX;
  var vectorY = rdmPosY - meteorY;
  var vectorLength = Math.sqrt(vectorX*vectorX + vectorY*vectorY);
  var unitVectorX =  vectorX / vectorLength;
  var unitVectorY =  vectorY / vectorLength;
  return [unitVectorX*asteroidMovingSpeed, unitVectorY*asteroidMovingSpeed];

}

function wanderingStars() {
  if (cometsTimer > 0) {
    cometsTimer -= 1;
  } else if (asteroids.length < asteroidsNum) {
    cometsTimer = wanderingStarsDelay;
    var edge = parseInt(Math.random()*4); // 0 1 2 3
    var meteorX = 0;
    var meteorY = 0;
    if (edge == 0) {
      meteorX = Math.random()*canvas.width;
      // y top is 0, just above the top, outside the screen
      meteorY = -asteroidRadiusMax;
    } else if (edge == 2) {
      meteorX = Math.random()*canvas.width;
      // y top is 0, just above the top, outside the screen
      meteorY = canvas.height + asteroidRadiusMax;
    } else if (edge == 1) {
      meteorX = -asteroidRadiusMax;
      // y top is 0, just above the top, outside the screen
      meteorY = Math.random()*canvas.height;
    } else if (edge == 3) {
      meteorX = canvas.width + asteroidRadiusMax;
      // y top is 0, just above the top, outside the screen
      meteorY = Math.random()*canvas.height;
    }

    var comingInHot = comingInVector(meteorX, meteorY);
    spawnAsteroid(meteorX, meteorY, comingInHot[0] , comingInHot[1]);
  }
}

function updateAsteroids () {
  for (var i=asteroids.length-1; i>=0; i--) {
    asteroids[i].asteroidX += asteroids[i].velocityX;
    asteroids[i].asteroidY += asteroids[i].velocityY;
    asteroids[i].asteroidAngle += asteroidRotationSpeed;
    // erase out-of-screen asteroids from the memory
    if (asteroids[i].asteroidX < 0 - asteroidRadiusMax ||
      asteroids[i].asteroidX > canvas.width + asteroidRadiusMax ||
      asteroids[i].asteroidY < 0 - asteroidRadiusMax ||
      asteroids[i].asteroidY > canvas.height + asteroidRadiusMax) {
        asteroids.splice(i, 1);
        console.log(asteroids.length);
      }
  }
}

function frame() {
  time += 1;
  updateMovement();
  updateRotation();
  updateLaser();
  updateAsteroids();
  wanderingStars();
  handleExplosion();
  draw();
}

document.addEventListener('keydown', (event) => {
  if (event.key === "w") {
    console.log('isUpPressed');
    isUpPressed = true;
  } else if (event.key === "a") {
    console.log('isLeftPressed');
    isLeftPressed = true;
  } else if (event.key === "s") {
    console.log('isDownPressed');
    isDownPressed = true;
  } else if (event.key === "d") {
    console.log('isRightPressed');
    isRightPressed = true;
  }
  else if (event.key === " ") {
    console.log('isSpacePressed');
    isSpacePressed = !isSpacePressed;
  }
}, false);

// detect how long the key is being pressed down
document.addEventListener('keyup', (event) => {
  if (event.key === "w") {
    console.log('isUpPressed');
    isUpPressed = false;
  } else if (event.key === "a") {
    console.log('isLeftPressed');
    isLeftPressed = false;
  } else if (event.key === "s") {
    console.log('isDownPressed');
    isDownPressed = false;
  } else if (event.key === "d") {
    console.log('isRightPressed');
    isRightPressed = false;
  }
}, false);


setInterval(function(){
  frame()
}, 100);

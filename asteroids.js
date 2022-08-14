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

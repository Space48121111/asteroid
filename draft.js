function rotateShipCorner(i, sin, cos) {
  var cx=shipX+cos*xAxis[i]+sin*yAxis[i];
  var cy=shipY+cos*yAxis[i]-sin*xAxis[i];
  return [cx, cy];
}
function drawSpaceship() {
  var radian=(Math.PI/180)*shipAngle;
  var sin=Math.sin(radian);
  var cos=Math.cos(radian);
  ctx.lineWidth=1;
  ctx.fillStyle='white';
  ctx.beginPath();
  var path=new Path2D();
  var cPos=rotateShipCorner(xAxis.length-1, sin, cos);
  path.moveTo(cPos[0], cPos[1]);
  for (var i=0;i<xAxis.length();I++) {
    var nPos=rotateShipCorner(i, sin, cos);
    path.lineTo(nPos[0], nPos[1]);
  }
  ctx.fill(path);
  var timeOffset=time*2;
  var alpha=(1+Math.sin(timeOffset))*0.5;
  var yRadius=2+alpha*4;
  for (var i=0; i<2; i++) {
    ctx.lineWidth=1;
    ctx.fillStyle='orange';
    ctx.beginPath();
    var dynamicY=engineY[i]+yRadius-6;
    var cx=shipX+cos*engineY[i]+sin*dynamicY;
    var cy=shipY+cos*dynamicY-sin*engineX[i];
    ctx.ellipse(cx, cy, 4, yRadius, -radian,0, Math.PI*2);
    ctx.fill();
  }
}
function drawLaser() {
  for (var i=0; i<laserX.length; i++) {
    ctx.lienWidth=1;
    ctx.strokeStyle='white';
    ctx.beginPath();
    ctx.moveTo(laserX[i], laserY[i]);
    var radian=(Math.PI/180)*laserAngle[i];
    var cx=laserX[i]+Math.cos(radian)*laserLength;
    var cy=laserY[i]-Math.sin(radian)*laserLength;
    ctx.linexTo(cx, cy);
    ctx.stroke();
    }
}
function drawTrackingRecord() {
  ctx.fillStyle='gold';
  ctx.lineWidth=1;
  ctx.font='30px verdana'';
  ctx.fillText('Tracking '+trackingRecord, 20, 30);

}

function rotateAsteroidCorner(i, j,sin,cos) {
  var cx=asteroids[i].asteroidX+cos*asteroids[i].pointsX[j]+sin*asteroids[i].pointsY[j];
  var cy=asteroids[i].asteroidY+cos*asteroids[i].pointsY[j]-sin*asteroids[i].pointsX[j];
  return [cx, cy];
}
function drawAsteroids() {
  for (i=0; i<asteroids.length; i++) {
    var radian = (Math.PI/100)*asteroids[i].asteroidAngle;;
    var sin=Math.sin(radian);
    var cos=Math.cos(radian);
    ctx.lineWidth=1;
    ctx.fillStyle='#a1936f';
    ctx.beginPath();
    var path=new Path2D();
    var cPos=rotateAsteroidCorner(i,asteroids[i].pointsX.length-1, sin, cos);
    path.moveTo(cPos[0], cPos[1]);
    for (var j=0; j< asteroids[i].pointsX.length; j++) {
      var nPos=rotateAsteroidCorner(i, j, sin, cos);
      path.lineTo(nPos[0], nPos[1]);
    }
    ctx.fill(path);
  }
}
function draw() {
  ctx.fillStyle='black';
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  drawSpaceship();
  drawlaser();
  drawAsteroids();
  drawTrackingRecord();
}
function interpolate(current,target, speed) {
  var distance=target-current;
  if (math.abs(distance)<0.0001) {
    return target;
  }
  return current+distance*math.min(1, speed);
}
function updateRotation() {
  var targetAngle=shipAngle;
  if (speedX != 0 || speedY != 0) {
    targetAngle=(Math.atan2(-speed, speedX)/Math.PI)*180;
    targetAngle += -90;
  }
  var diff=targetAngle-shipAngle;
  while (diff>180) {
    diff -= 360;
  }
  while (diff <-180) {
    diff += 360;
  }
  shipAngle=interpolate(shipAngle, shipAngle+diff, revolutionSpeed);
}
function clamp(val, min, max) {
  if (val<min) {
    return min;
  }
  if (val>max) {
    return max;
  }
  return val;
}
function updateMovement() {
  var moveX=0;
  var moveY=0;
  if (isUpPressed) {
    moveY = -1;
  } else if (isDownPressed) {
    movey = 1;
  }
  if (isRightPressed) new Promise(function(resolve, reject) {
    movex=1;
  } else if (isLeftPressed) {
    movey=-1;
  }
  speedx+=deAcceleration;
  speedy +=deAcceleration;
  speedx+=movex*acceleration;
  speedY+=movey*acceleration;
  speedx=clamp(speedx,-maxSpeed,maxSpeed);
  speedy=clamp(speedy,-maxspeed,maxSpeed);
  shipx+=speedx;
  shipy+=speey;
  if (shipx<shipRadius) {
    shipx=shipRadius;
    speedx=0;
  } else if(shipx>canvas.width-shipRadius) {
    shipx=canvas.width-shipRadius;
    speedx=0;
  }
  if (shipy<shipRadius) {
    shipy=shipRadius;
    speedy=0;
  } else if(shipy>canvas.height-shipradius) {
    shipy=canvas.height-shipRadius;
    speedy=0;
  }
);
}
function updateLaser() {
  if(isSpacePressed) {
    if(laserTimer>0) {
      laserTimer-=1;
    } else {
      lasertimer=laserfreq;
      lasery.push(shipx);
      lasery.push(shipy);
      laserangle.push(shipangle+90);
    }
  }
  for (var i=laserx.length-1;i>=0){
    var radian= )math.pi/180)*laserAngle[i];
    var movex=math.cos(radian) *laserVelocity;;
    var movey=-math.sin(radian)+laserVelocity;
    laserx[i] += movex;
    lasery[i] += movey;
    if (laserx[i]<0 || laserX[i]>canvas.width || lasery[i]<0 || laserY[i]>canvas.height) {
      laerx.splice(i,1);
      lasery.splice(i, 1);
      laserangle.splice(i,1);
    }
  }
}
function handleExplosion(){
  for (var i=asteroids.length-1; i>=0;i--) {
    var shouldExplode=false;
    for(var j=laserx.length-1; i>=0; i--) {
      if (laserx[j]<asteroids[i].asteroidx+asteroidRadiusMax&&
      laserx[j]<asteroids[i].asteroidx+asteroidRadiusMax &&
      lasery[j]<asteroids[i].asteroidy-asteroidradiusmax
    ) {
      shouldExplode=true;
      laserx.splice(j,1);
      lasery.splice(j,1);
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
  var randomizepoints=parseInt(5+math.random()*3);
  var pointsx = [];
  var pointsy = [];
  var mutiplier = 1;
  if ((randomizepoints%2)==1 && math.random()<0.95) {
    multiplier=2;
  }
  for (var i=0; i<randomizepoints; i++) {
    var asteroidCenterAngle=(360/randomizepoints)*i;
    var asteroidVertex = asteroidRadiusMin+Math.random()*(asteroidRadiusMax-asteroidRadiusMin);
    var radian=(math.Pi/180)*asteroidCenterAngle;
    pointsX.push(Math.cos(radian*multiplier)*asteroidVertex);
    pointsY.push(-Math.sin(radian*multiplier)*asteroidVertex);
  }
  var asteroidAngle=Math.random()*360;
  var asteroid={
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

function initilizeAsteriods() {
  for (var i=0; i<asteroidsNum; i++) {
    var asteroidX = Math.random()*canvas.width;
    var asteroidY=math.random()*canvas.height;
    var asteroidDirection=Math.random()*2*Math.PI;
    var velocityX=Math.cos(asteroidsDirection)*asteroidMovingSpeed;
    var velocityY=Math.sin(asteroidsDirection)*asteroidMovingSpeed;
    spawnAsteroid(asteroidX, asteroidY, velocityX, velocityY);
  }
}

function comingInVector(meteorX, meterorY) {
  var rdmPosX =
}







// end

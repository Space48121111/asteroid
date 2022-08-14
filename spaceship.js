
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

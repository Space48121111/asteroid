
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

  // rendering engine flickering
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

function interpolate(current, target, speed) {
  var angleTrajectory = target - current;
  // ignore the diff once it approaches indefinitely to the target
  if (Math.abs(angleTrajectory) < 0.0001) {
    return target;
  }
  // speed <= 1, at most the target val that it won't over-shoot
  return current + angleTrajectory*Math.min(1, speed);
}

function updateRotation() {
  // if (isRightPressed) {
  //   shipAngle += revolutionSpeed;
  // } else if (isLeftPressed) {
  //   shipAngle -= revolutionSpeed;
  // }

  // inertial angle
  var targetAngle = shipAngle;
  if (vectorVelocityX != 0 || vectorVelocityY != 0) {
    // - neg: going upwards
    targetAngle = (Math.atan2(-vectorVelocityY, vectorVelocityX)/Math.PI)*180;
    targetAngle += -90;
  }
  // turn within -180-180 degrees
  var diff = targetAngle - shipAngle;
  while (diff > 180) {
    diff -= 360; // 270-360 = -90
  }
  while (diff < -180) {
    diff += 360;
  }
  shipAngle = interpolate(shipAngle, shipAngle+diff, revolutionSpeed);
}

// within the velocity bounds
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
  var dirX = 0;
  var dirY = 0;
  if (isUpPressed) {
    dirY = -1;
  } else if (isDownPressed) {
    dirY = 1;
  }
  if (isRightPressed) {
    dirX = 1;
  } else if (isLeftPressed) {
    dirX = -1;
  }
  // break first then turn
  vectorVelocityX *= deAcceleration;
  vectorVelocityY *= deAcceleration;
  vectorVelocityX += dirX * acceleration;
  vectorVelocityY += dirY * acceleration;
  vectorVelocityX = clamp(vectorVelocityX, -maxSpeed, maxSpeed);
  vectorVelocityY = clamp(vectorVelocityY, -maxSpeed, maxSpeed);

  shipX += vectorVelocityX;
  shipY += vectorVelocityY;

  // edges
  if (shipX < shipRadius) {
    shipX = shipRadius;
    vectorVelocityX = 0;
  } else if (shipX > canvas.width-shipRadius) {
    shipX = canvas.width - shipRadius;
    vectorVelocityX = 0;
  }

  if (shipY < shipRadius) {
    shipY = shipRadius;
    vectorVelocityY = 0;
  } else if (shipY > canvas.height-shipRadius) {
    shipY = canvas.height - shipRadius;
    vectorVelocityY = 0;
  }
}

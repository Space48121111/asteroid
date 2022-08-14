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

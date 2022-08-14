function spawnExplosion(x, y) {
  var spikesX = [];
  var spikesY = [];
  var numOfSpikes = 5;
  for (var i=0; i<numOfSpikes; i++) {
    var spikesAngle = (360/numOfSpikes)*i;
    var radian = (Math.PI/180)*spikesAngle;
    var spikeLength = 0.8 + 0.5 * Math.random(); // 0.9 - 1.4
    spikesX.push(Math.cos(radian*2)*spikeLength);
    spikesY.push(-Math.sin(radian*2)*spikeLength);
  }
  var bang = {
    bigBangX: x,
    bigBangY: y,
    bigBangRadius: 1,
    spikesX: spikesX,
    spikesY: spikesY
  }
  bigBang.push(bang);
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
    // only remove the asteroid once
    if (shouldExplode) {
      spawnExplosion(asteroids[i].asteroidX, asteroids[i].asteroidY);
      asteroids.splice(i, 1);
      trackingRecord += 1;
    }
  }
}

function bigBangPos(i, j, spikeExplosionRadius) {
  var spikeX = bigBang[i].bigBangX + bigBang[i].spikesX[j]*spikeExplosionRadius;
  var spikeY = bigBang[i].bigBangY + bigBang[i].spikesY[j]*spikeExplosionRadius;
  return [spikeX, spikeY];
}

function drawExplosion() {
  for (i=0; i<bigBang.length; i++) {
    ctx.lineWidth = 2;
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(bigBang[i].bigBangX, bigBang[i].bigBangY, bigBang[i].bigBangRadius, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    var path=new Path2D();
    var cRadius = bigBang[i].bigBangRadius + spikesRadius;
    // len-1: the index of the last element in the spikesX array
    var cPos= bigBangPos(i, bigBang[i].spikesX.length-1, cRadius);
    path.moveTo(cPos[0], cPos[1]);
    for (var j=0; j<bigBang[i].spikesX.length; j++) {
      var nPos = bigBangPos(i, j, cRadius);
      path.lineTo(nPos[0], nPos[1]);
    }
    ctx.fill(path);
  }
}

function updateExplosion() {
  for (var i=bigBang.length-1; i>=0; i--) {
    bigBang[i].bigBangRadius += 1;
    if (bigBang[i].bigBangRadius > bigBangMaxRadius) {
      bigBang.splice(i, 1);
    }
  }
}




// end

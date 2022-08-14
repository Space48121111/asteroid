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
      asteroids.splice(i, 1);
      trackingRecord += 1;
    }
  }
}

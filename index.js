function drawTrackingRecord() {
  ctx.fillStyle = 'gold';
  ctx.lineWidth = 1;
  ctx.font = '20px verdana';
  ctx.fillText('Tracking Record: '+ trackingRecord, 20, 30);
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
    isUpPressed = true;
  } else if (event.key === "a") {
    isLeftPressed = true;
  } else if (event.key === "s") {
    isDownPressed = true;
  } else if (event.key === "d") {
    isRightPressed = true;
  }
  else if (event.key === " ") {
    isSpacePressed = !isSpacePressed;
  }
}, false);

// detect how long the key is being pressed down
document.addEventListener('keyup', (event) => {
  if (event.key === "w") {
    isUpPressed = false;
  } else if (event.key === "a") {
    isLeftPressed = false;
  } else if (event.key === "s") {
    isDownPressed = false;
  } else if (event.key === "d") {
    isRightPressed = false;
  }
}, false);


setInterval(function(){
  frame()
}, 50);

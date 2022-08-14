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
var vectorVelocityX = 0;
var vectorVelocityY = 0;
var deAcceleration = 0.8;
var maxSpeed = 50;
var acceleration = 3;
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
var bigBang = [];
var bigBangMaxRadius = 11;
var spikesRadius = 5;

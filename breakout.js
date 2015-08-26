var canvas = $("#breakout")[0];
var ctx = canvas.getContext("2d");

if (typeof window.Breakout === undefined) {
  window.Breakout = {};
}

ctx.beginPath();
ctx.rect(200, 40, 50, 50);
ctx.fillStyle = "#F00";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.arc(240, 160, 100, 10, Math.PI*0.5, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.rect(160, 10, 100, 40);
ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
ctx.stroke();
ctx.closePath();

moveableElement = function (options) {
  this.x = options.x;
  this.y = options.y;
  this.dx = options.dx; //dx, dy are pixels per second
  this.dy = options.dy;
};

moveableElement.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, 10, 0, Math.PI*2);
  ctx.fillStyle = "#0055EE";
  ctx.fill();
  ctx.closePath();
};

moveableElement.prototype.move = function (time) {
  this.x += this.dx * time / 1000;
  this.y += this.dy * time / 1000;
};

moveableElement.prototype.frame = function (options) {
  this.draw();
  this.move( (options && options.time) || 100 );
};

var ball = new moveableElement ({x: 20, y: 20, dx: 20, dy: 20});
setInterval(ball.frame.bind(ball), 100);

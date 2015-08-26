var canvas = $("#breakout")[0];
var ctx = canvas.getContext("2d");

if (typeof window.Breakout === undefined) {
  window.Breakout = {};
}

inheritance = function (childClass, parentClass) {
  function Surrogate () {};
  Surrogate.prototype = parentClass.prototype;
  childClass.prototype = new Surrogate();
  childClass.prototype.constructor = childClass;
};

moveableElement = function (options) {
  _.extend(options || {}, {x: 10, y: 10, dx: 10, dy: 10, radius: 10});
  this.x = options.x;
  this.y = options.y;
  this.dx = options.dx; //dx, dy are pixels per second
  this.dy = options.dy;
  this.radius = options.radius;
};

_.extend(moveableElement.prototype, {
  draw: function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI*2);
    ctx.fillStyle = "#0055EE";
    ctx.fill();
    ctx.closePath();
  },

  move: function (time) {
    this.x += this.dx * time / 1000;
    this.y += this.dy * time / 1000;
  },

  frame: function (options) {
    this.draw();
    this.move( (options && options.time) || 100 );
  }
});

var ball = new moveableElement ({x: 20, y: 20, dx: 20, dy: 20});
setInterval(ball.frame.bind(ball), 100);

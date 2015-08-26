var canvas = $("#breakout")[0];
var ctx = canvas.getContext("2d");

if (typeof window.Breakout === undefined) {
  window.Breakout = {};
}

//by default, time is measured in ms.
// for readability reasons, speed is in pixel per s, and,
// this code will utilize time / 1000

inheritance = function (childClass, parentClass) {
  function Surrogate () {}
  Surrogate.prototype = parentClass.prototype;
  childClass.prototype = new Surrogate();
  childClass.prototype.constructor = childClass;
};

MoveableElement = function (options) {
  options = _.extend({x: 0, y: 0, dx: 0, dy: 0, radius: 5}, options);
  this.initialize(options);
};

_.extend(MoveableElement.prototype, {
  initialize: function (options) {
    this.x = options.x;
    this.y = options.y;
    this.dx = options.dx; //dx, dy are pixels per second
    this.dy = options.dy;
    this.radius = options.radius;
  },

  draw: function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = "#F00";
    ctx.fill();
    ctx.closePath();
  },

  handleCollision: function () {
    if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) { this.dy = -(this.dy); }
    if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) { this.dx = -(this.dx); }
  },

  move: function (time) {
    this.x += this.dx * time / 1000;
    this.y += this.dy * time / 1000;
    this.handleCollision();
  },

  frame: function (options) {
    this.draw();
    this.move( (options && options.time) || 50 );
  }
});

Paddle = function (options) {
  options = _.extend({x: canvas.width * 0.5, y: canvas.height * 0.9, dx: 0, width: 60, height: 5}, options);
  this.initialize(options);
  this.thrust = 0;

  this.keyDownHandler = function (event) {
    // left keyCode === 37; right keyCode === 39
    if(event.keyCode === 37 || event.keyCode === 39) {
      this.thrust = event.keyCode - 38;
    }
  };

  this.keyUpHandler = function (event) {
    this.thrust = 0;
  };

  jQuery(document).on("keydown", this.keyDownHandler.bind(this));
  jQuery(document).on("keyup", this.keyUpHandler.bind(this));
};

_.extend(Paddle.prototype, {
  initialize: function (options) {
    this.x = options.x;
    this.y = options.y;
    this.dx = options.dx;
    this.height = options.height;
    this.width = options.width;
  },

  draw: function () {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#00F";
    ctx.fill();
    ctx.closePath();
  },

  handleCollision: function () {
    if (this.x < 0 || this.x + this.width > canvas.width) { this.dx = 0; }
  },

  maxSpeed: 200000, //pixels / second: 200
  thrustCoefficient:   200000 / 200, //m / s / s
  dragCoefficient:     200000 / 1000, //m / s / s

  move: function (time) {
    if (this.thrust && Math.abs(this.dx) < this.maxSpeed) {
      this.dx += this.thrust * time / 1000 * this.thrustCoefficient;
    }
    this.dx = (this.dx > 0 ? 1 : -1) * (Math.max(0, Math.abs(this.dx) - this.dragCoefficient * time / 1000 ));

    // this.x += Math.max(0, Math.min( canvas.width - this.width, this.dx * time / 1000));
    this.x += this.dx * time / 1000;
    this.x = Math.min(canvas.width - this.width, Math.max(0, this.x));
    this.handleCollision();
  },

  frame: function (options) {
    this.draw();
    this.move( (options && options.time) || 50 );
  }
});



var ball = new MoveableElement ({x: 20, y: 20, dx: -50, dy: -50});
var paddle = new Paddle ({});
var spf = 1000/60;
setInterval(function () {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ball.frame({time: spf});
  paddle.frame({time: spf});
}, spf);

var canvas = $("#breakout")[0];
var ctx = canvas.getContext("2d");

if (typeof window.Breakout === "undefined") {
  window.Breakout = {};
}

/*
* by default, time is measured in ms.
*  for readability reasons, speed is in pixel per s, and,
*  this code will utilize time / 1000
*/

Breakout.setInheritance = function (childClass, parentClass) {
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

  checkWallCollision: function () {
    if (this.x - this.radius < 0) { this.dx = Math.abs(this.dx); }
    else if (this.x + this.radius > canvas.width) { this.dx = -Math.abs(this.dx); }

    if (this.y - this.radius < 0) { this.dy = Math.abs(this.dy); }
    else if ( this.y > canvas.height ) {
      alert("GAME OVER");
      document.location.reload();
    }
  },

  collide: function (dx, dy) {
    // flips the direction of ball.
    var len = Math.sqrt(dx * dx + dy * dy);
    dx = dx / len;
    dy = dy / len;

    var dot = dx * this.dx + dy * this.dy;
    if (dot > 0) return;

    this.dx = this.dx - 2 * dx * dot;
    this.dy = this.dy - 2 * dy * dot;
  },

  move: function (time) {
    this.x += this.dx * time / 1000;
    this.y += this.dy * time / 1000;
    this.checkWallCollision();
  },

  frame: function (options) {
    this.draw();
    this.move( (options && options.time) || 50 );
  }
});

RectElement = function (options) {
  options = _.extend({x: 0, y: 0, dx: 0, width: 60, height: 5}, options);
  this.initialize(options);
};

_.extend(RectElement.prototype, {
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

  checkCollision: function (ball) {
    var dx = 0, dy = 0;

    if (ball.y < this.y) { dy = ball.y - this.y; }
    else if (ball.y > this.y + this.height) { dy = ball.y - (this.y + this.height); }
    if (dy > ball.radius) return; // short circuit to avoid unnecessary calculations

    if (ball.x < this.x) { dx = ball.x - this.x; }
    else if (ball.x > this.x + this.width) { dx = ball.x - (this.x + this.width); }
    if (dx > ball.radius) return; // short circuit to avoid unnecessary calculations

    var dd = Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2) );
    if ( dd < ball.radius ) {
      ball.collide(dx, dy);
    }
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
  jQuery(document).on("keydown", this.keyDownHandler.bind(this));
  jQuery(document).on("keyup", this.keyUpHandler.bind(this));
};

Breakout.setInheritance(Paddle, RectElement);

_.extend(Paddle.prototype, {
  keyDownHandler: function (event) {
    // left keyCode === 37; right keyCode === 39
    if(event.keyCode === 37 || event.keyCode === 39) {
      this.thrust = event.keyCode - 38;
    }
  },

  keyUpHandler: function (event) {
    this.thrust = 0;
  },

  maxSpeed:            200000, //pixels / second: 200
  thrustCoefficient:   200000 / 200, //m / s / s
  dragCoefficient:     200000 / 1000, //m / s / s

  move: function (time) {
    if (this.thrust && Math.abs(this.dx) < this.maxSpeed) {
      this.dx += this.thrust * time / 1000 * this.thrustCoefficient;
    }
    this.dx = (this.dx > 0 ? 1 : -1) * (Math.max(0, Math.abs(this.dx) - this.dragCoefficient * time / 1000 ));

    this.x += this.dx * time / 1000;
    this.x = Math.min(canvas.width - this.width, Math.max(0, this.x));
    this.checkWallCollision();
  },

  checkWallCollision: function () {
    if ( (this.dx < 0 && this.x <= 0) ||
         (this.dx > 0 && this.x + this.width >= canvas.width) ) { this.dx = 0; }
  },
});

var ball = Breakout.ball = new MoveableElement ({x: 20, y: 20, dx: 100, dy: 100});
var paddle = Breakout.paddle = new Paddle ({});

var spf = 1000/60;
setInterval(function () {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ball.frame({time: spf});
  paddle.frame({time: spf});
  paddle.checkCollision(ball);
}, spf);

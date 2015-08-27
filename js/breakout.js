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

var MoveableElement = Breakout.MoveableElement = function (options) {
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
    this.speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
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
      clearInterval(Breakout.schedule);
    }
  },

  collide: function (dx, dy, mx, my) {
    // flips the direction of ball.
    var len = Math.sqrt(dx * dx + dy * dy);
    dx = dx / len || 0;
    dy = dy / len || 0;

    var dot = dx * this.dx + dy * this.dy;
    if (dot > 0) return;

    this.dx = this.dx - 2 * dx * dot;
    this.dy = this.dy - 2 * dy * dot;

    if (mx || my) {
      this.dx += mx * 0.2;
      this.dy += my * 0.2;
      var factor = this.speed / Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      this.dx = this.dx * factor;
      this.dy = this.dy * factor;
    }
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

var RectElement = Breakout.RectElement = function (options) {
  options = _.extend({x: 0, y: 0, dx: 0, width: 60, height: 5, color: "#FFF",}, options);
  this.initialize(options);
};

_.extend(RectElement.prototype, {
  initialize: function (options) {
    this.x = options.x;
    this.y = options.y;
    this.dx = options.dx;
    this.height = options.height;
    this.width = options.width;
    this.color = options.color;
  },

  draw: function () {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
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
      ball.collide(dx, dy, this.dx || 0, this.dy || 0);
      return true;
    }
  },

  frame: function (options) {
    this.draw();
    this.move( (options && options.time) || 50 );
  }
});

var Brick = Breakout.Brick = function (options) {
  options = _.extend({x: 0, y: 0, dx: 0, width: 100, height: 10, color: "#0F0"}, options);
  this.initialize(options);
  this.thrust = 0;
};

Breakout.setInheritance(Brick, RectElement);

_.extend(Brick.prototype, {
  frame: function (options) {
    this.draw();
    if (this.checkCollision(Breakout.ball)) this.remove();
  },

  remove: function () {
    var idx = Breakout.bricks.indexOf(this);
    if (idx >= 0) Breakout.bricks.splice(idx, 1);
  }
});

var Paddle = Breakout.Paddle = function (options) {
  options = _.extend({
    x: canvas.width * 0.5,
    y: canvas.height * 0.9,
    color: "#00F",
    dx: 0,
    width: 60,
    height: 8}, options);
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

  maxSpeed:            150000, //pixels / second: 200
  thrustCoefficient:   200000 / 100, //m / s / s
  dragCoefficient:     200000 / 250, //m / s / s

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
Breakout.paddle = new Paddle ({});
Breakout.bricks = _([]);

var BrickField = Breakout.BrickField = function (options) {
  options = _.extend({
    wall_padding: 30,
    brick_padding: 5,
    col_count: 12,
    row_count: 6,
    height: 10,
  }, options);
  options.width = canvas.width - (2 * options.wall_padding) - (options.col_count - 1) * options.brick_padding;
  options.width = options.width / options.col_count;
  var x, y;
  for (c = 0; c < options.col_count; c++) {
    for (r = 0; r < options.row_count; r++) {
      options.x = options.wall_padding + c * (options.width + options.brick_padding);
      options.y = options.wall_padding + r * (options.height + options.brick_padding);
      Breakout.bricks.push( new Brick(options) );
    }
  }
};

new BrickField();

var time = {time: 1000/60};

Breakout.scheduler = function () {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  Breakout.bricks.each(function (brick) {brick.frame(time);});
  Breakout.ball.frame(time);
  Breakout.paddle.frame(time);
  Breakout.paddle.checkCollision(ball);
};

Breakout.schedule = setInterval( Breakout.scheduler, time.time);

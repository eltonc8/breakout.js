!(function () {
  if (typeof window.Breakout === "undefined") {
    window.Breakout = {};
  }

  var RectElement = Breakout.RectElement;

  var Paddle = Breakout.Paddle = function (options) {
    options = _.extend({
      x: canvas.width * 0.5,
      y: canvas.height * 0.9,
      color: "#00F",
      dx: 0,
      width: 60,
      height: 8
    }, options);
    this.initialize(options);
    this.thrust = 0;
  };

  Breakout.setInheritance(Paddle, RectElement);

  _.extend(Paddle.prototype, {
    draw: function () {
      debugger
      this.superClass.draw.call(this);
      if (this.ball) {
        this.ball.draw();
        new Breakout.CircularElement({
          color: "#FF0",
          radius: 3,
          x: this.ball.x + this.ball.dx,
          y: this.ball.y + this.ball.dy
        }).draw();
      }
    },

    keyDownCodeHandler: function (keyCode) {
      // left keyCode === 37; right keyCode === 39
      if(keyCode === 37 || keyCode === 39) {
        this.thrust = keyCode - 38;
      }
    },

    keyUpCodeHandler: function (keyCode) {
      this.thrust = 0;
    },

    maxSpeed:            150000, //pixels / second: 200
    thrustCoefficient:   200000 / 100, //m / s / s
    dragCoefficient:     200000 / 250, //m / s / s

    move: function (runtimeOptions) {
      unit = runtimeOptions.ms * (runtimeOptions.accel) * (runtimeOptions.difficulty) / 1000;
      if (this.thrust && Math.abs(this.dx) < this.maxSpeed) {
        this.dx += this.thrust * unit * this.thrustCoefficient;
      }
      this.dx = (this.dx > 0 ? 1 : -1) * (Math.max(0, Math.abs(this.dx) - this.dragCoefficient * unit ));

      this.x += this.dx * unit;
      this.x = Math.min(canvas.width - this.width, Math.max(0, this.x));
      this.checkWallCollision();
      if (this.ball) {
        this.ball.x = this.x + this.width / 2;
        this.ball.y = this.y - this.ball.radius * 2;
        var rad = new Date() * Math.PI / 2000;
        rad = (Math.cos(rad)) * Math.PI / 4;
        this.ball.dx = -Math.sin(rad) * 50;
        this.ball.dy = -Math.cos(rad) * 50;
      }
    },

    checkWallCollision: function () {
      if ( (this.dx < 0 && this.x <= 0) ||
           (this.dx > 0 && this.x + this.width >= canvas.width) ) { this.dx = 0; }
    },
  });
})();

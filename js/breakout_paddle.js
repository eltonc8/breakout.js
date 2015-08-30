!(function () {
  if (typeof window.Breakout === "undefined") {
    window.Breakout = {};
  }

  var RectElement = Breakout.RectElement;

  var Paddle = Breakout.Paddle = function (options) {
    options = _.extend({
      x: (canvas.width - 30) * 0.5,
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
    checkWallCollision: function () {
      if ( (this.dx < 0 && this.x <= 0) ||
           (this.dx > 0 && this.x + this.width >= canvas.width) ) { this.dx = 0; }
    },

    ballLaunchDraw: function () {
      this.ball.draw();
      for (i = 2; i < 5; i++) {
        new Breakout.CircularElement({
          color: "#00" + hex(360 - 50 * i) + "00",
          radius: i,
          x: this.ball.x + this.ball.dx * 15 * i,
          y: this.ball.y + this.ball.dy * 15 * i,
        }).draw();
      }
    },

    ballLaunchUpdate: function () {
      this.ball.x = this.x + this.width/2;
      this.ball.y = this.y - this.ball.radius * 2;
      var rad = new Date() * Math.PI / 2000;
      rad = (Math.cos(rad)) * Math.PI / 4;
      this.ball.dx = -Math.sin(rad);
      this.ball.dy = -Math.cos(rad);
    },

    draw: function () {
      this.superClass.draw.call(this);
      if (this.ball) this.ballLaunchDraw();
    },

    keyDownCodeHandler: function (keyCode) {
      // left keyCode === 37; right keyCode === 39
      this._mouseTarget = 0;
      if(keyCode === 37 || keyCode === 39) {
        this.thrust = keyCode - 38;
      }
    },

    keyUpCodeHandler: function (keyCode) {
      this.thrust = 0;
    },

    _maxSpeed:            150000, //pixels / second: 150
    _thrustCoefficient:     2500, //m / s / s
    _dragCoefficient:       1000, //m / s / s

    move: function (runtimeOptions) {
      unit = runtimeOptions.ms * (runtimeOptions.accel) * (runtimeOptions.difficulty) / 1000;
      this._speedUpdate(unit);

      this.x += this.dx * unit;
      this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));

      this.checkWallCollision();
      if (this.ball) this.ballLaunchUpdate();
    },

    mouseMoveHandler: function (relativeX) {
      this._mouseTarget = Math.max(0.1, relativeX);
    },

    _speedUpdate: function (unit) {
      var dragCoefficient = this._dragCoefficient;
      if (this._mouseTarget) {
        var delta = this._mouseTarget - (this.x + this.width/2);
        this.thrust = Math.max(-1, Math.min(1, (delta) / (this.width) ));
        if (0.0 < this.thrust * this.dx) {
          dragCoefficient = Math.abs(this.dx * this.dx / (2 * delta));
        }
      }
      this.dx += this.thrust * unit * this._thrustCoefficient;

      this.dx = Math.max(-this._maxSpeed, Math.min(this._maxSpeed, this.dx));
      this.dx = (this.dx > 0 ? 1 : -1) * (Math.max(0, Math.abs(this.dx) - dragCoefficient * unit ));
    }
  });
})();

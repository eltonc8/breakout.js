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

    move: function (runtimeOptions) {
      unit = runtimeOptions.ms * (runtimeOptions.accel) * (runtimeOptions.difficulty) / 1000;
      if (this.thrust && Math.abs(this.dx) < this.maxSpeed) {
        this.dx += this.thrust * unit * this.thrustCoefficient;
      }
      this.dx = (this.dx > 0 ? 1 : -1) * (Math.max(0, Math.abs(this.dx) - this.dragCoefficient * unit ));

      this.x += this.dx * unit;
      this.x = Math.min(canvas.width - this.width, Math.max(0, this.x));
      this.checkWallCollision();
    },

    checkWallCollision: function () {
      if ( (this.dx < 0 && this.x <= 0) ||
      (this.dx > 0 && this.x + this.width >= canvas.width) ) { this.dx = 0; }
    },
  });
})();

!(function () {
  if (typeof window.Breakout === "undefined") {
    window.Breakout = {};
  }

  var CircularElement = Breakout.CircularElement = function (options) {
    options = _.extend({
      x: canvas.width / 2,
      y: canvas.height * 0.8,
      dx: 141,
      dy: 141,
      radius: 5,
      color: "#F00"
    }, options);
    this.initialize(options);
  };

  _.extend(CircularElement.prototype, {
    initialize: function (options) {
      this.x = options.x;
      this.y = options.y;
      this.dx = options.dx; //dx, dy are pixels per second
      this.dy = options.dy;
      this.color = options.color;
      this.radius = options.radius;
      this.accel = -0.10;
      this.speed = options.speed || 200;
    },

    draw: function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    },

    checkWallCollision: function () {
      if      (this.x - this.radius < 0) { this.dx = Math.abs(this.dx); }
      else if (this.x + this.radius > canvas.width) { this.dx = -Math.abs(this.dx); }

      if (this.y - this.radius < 0) { this.dy = Math.abs(this.dy); }
    },

    checkCollision: function (ball) {
      if (ball === this) return;

      var dx = ball.x - this.x, dy = ball.y - this.y, radii = ball.radius + this.radius;
      if (dx > radii || dy > radii) return; // short circuit to avoid unnecessary calculations

      var dd = Math.sqrt( dx * dx + dy * dy );
      if ( dd < ball.radius ) {
        ball.collide(dx, dy, this.dx || 0, this.dy || (!dx && !dy && -10) || 0 );
        return true;
      }
    },

    collide: function (dx, dy, mx, my, accel) {
      //dx, dy are difference to closest surface, vector component (normal)
      //mx, my are momentum vector components (for friction)
      // flips the direction of ball.
      // 1] normalize the vector first.
      var len = Math.sqrt(dx * dx + dy * dy);
      dx = dx / len || 0;
      dy = dy / len || 0;

      // 2] offset the ball's position to reduce overlap to 0. Use normal vector.
      this.x += dx * (this.radius - len);
      this.y += dy * (this.radius - len);

      // 3] check dot product. < 0 = ball heading into object (anti parllel to normal)
      var dot = dx * this.dx + dy * this.dy;
      if (dot > 0) return;

      // 4] flip this.velocity with respect to normal (myV - 2 * normalV * dot)
      this.dx = this.dx - 2 * dx * dot;
      this.dy = this.dy - 2 * dy * dot;

      // 5] this imparts momentum. "friction"
      if (mx || my) {
        this.dx += mx * 0.2;
        this.dy += my * 0.2;
      }

      this.normalizeSpeed();
    },

    move: function (runtimeOptions) {
      unit = runtimeOptions.ms * (runtimeOptions.accel) * (runtimeOptions.difficulty) / 1000;
      this.x += this.dx * unit;
      this.y += this.dy * unit;
      this.checkWallCollision();
    },

    normalizeSpeed: function (options) {
      var factor = this.speed / Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      this.dx = this.dx * factor;
      this.dy = this.dy * factor;
    }
  });
})();

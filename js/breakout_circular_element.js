!(function () {
  if (typeof window.Breakout === "undefined") {
    window.Breakout = {};
  }

  var CircularElement = Breakout.CircularElement = function (options) {
    options = _.extend({
      x: canvas.width / 2,
      y: canvas.height * 0.8,
      dx: 141,
      dy: 141.8,
      radius: 5,
    }, options);
    this.initialize(options);
  };

  _.extend(CircularElement.prototype, {
    initialize: function (options) {
      this.x = options.x;
      this.y = options.y;
      this.dx = options.dx; //dx, dy are pixels per second
      this.dy = options.dy;
      this.radius = options.radius;
      this.speed = options.speed || Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    },

    draw: function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      ctx.fillStyle = "#F00";
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

    collide: function (dx, dy, mx, my) {
      //dx, dy are difference to closest surface, vector component (normal)
      //mx, my are momentum vector components
      // flips the direction of ball.
      var len = Math.sqrt(dx * dx + dy * dy);
      dx = dx / len || 0;
      dy = dy / len || 0;

      this.x += dx * (this.radius - len)
      this.y += dy * (this.radius - len)

      var dot = dx * this.dx + dy * this.dy;
      if (dot > 0) return;

      this.dx = this.dx - 2 * dx * dot;
      this.dy = this.dy - 2 * dy * dot;

      if (mx || my) {
        // this imparts momentum. "friction"
        this.dx += mx * 0.2;
        this.dy += my * 0.2;
      }

      var factor = this.speed / Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      this.dx = this.dx * factor;
      this.dy = this.dy * factor;
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
})();

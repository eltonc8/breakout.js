!(function () {
  if (typeof window.Breakout === "undefined") {
    window.Breakout = {};
  }

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

    checkCollision: function (ball) {
      var dx = 0, dy = 0;

      if      (ball.y < this.y) { dy = ball.y - this.y; }
      else if (ball.y > this.y + this.height) { dy = ball.y - (this.y + this.height); }
      if (dy > ball.radius) return; // short circuit to avoid unnecessary calculations

      if      (ball.x < this.x) { dx = ball.x - this.x; }
      else if (ball.x > this.x + this.width) { dx = ball.x - (this.x + this.width); }
      if (dx > ball.radius) return; // short circuit to avoid unnecessary calculations

      var dd = Math.sqrt( dx * dx + dy * dy );
      if ( dd < ball.radius ) {
        ball.collide(dx, dy, this.dx || 0, this.dy || (!dx && !dy && -10) || 0 );
        return true;
      }
    },

    draw: function () {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    },

    frame: function (options) {
      this.draw();
      this.move( (options && options.time) || 50 );
    },

    move: function () {}
  });
})();

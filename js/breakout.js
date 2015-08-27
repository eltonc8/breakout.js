!(function () {
  if (typeof window.Breakout === "undefined") {
    window.Breakout = {};
  }

  /*
  * by default, time is measured in ms.
  *  for readability reasons, speed is in pixel per s, and,
  *  this code will utilize time / 1000
  */

  Breakout.Game = function (options) {
    options = _.extend({
      paddle: new Breakout.Paddle ({}),
      bricks: new Breakout.BrickField({col_count_null: 12, row_count_null: 4, pattern: options && options.pattern}),
      ball: new Breakout.CircularElement ({x: 20, y: 20, dx: 100, dy: 100})
    }, options);
    this.paddle = options.paddle;
    this.bricks = options.bricks;
    this.ball = options.ball;
    this.activate();
  };

  _.extend(Breakout.Game.prototype, {
    runtimeOptions: {ms: 1000/60},

    activate: function () {
      this.scheduler = setInterval( this.frame.bind(this), this.runtimeOptions.ms);
    },

    draw: function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ball.draw();
      this.paddle.draw();

    },

    removeBrick: function (brick) {
      var idx = this.bricks.indexOf(brick);
      if (idx >= 0) this.bricks.splice(idx, 1);
    },

    checkCollision: function () {
      this.paddle.checkCollision(this.ball);
      this.walls.each( function (wall) {});
      var removes = _([]), ball = this.ball;
      this.bricks.each( function (brick) {
        if (brick.checkCollision(ball)) removes.push(brick);
      } );
      removes.each( this.removeBrick.bind(this) );
    },

    frame: function () {
      this.move();
      this.draw();
      this.checkCollision(this.ball);
    },

    move: function () {
      this.ball.move(this.runtimeOptions.ms);
      this.paddle.move(this.runtimeOptions.ms);
    }

  });

})();

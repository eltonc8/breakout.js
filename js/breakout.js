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
      bricks: new Breakout.BrickField(),
      balls: _([new Breakout.CircularElement ({x: 20, y: 20, dx: 100, dy: 100})]),
      score: 0,
    }, options);
    this.paddle = options.paddle;
    this.bricks = options.bricks;
    this.balls = options.balls;
    this.activate();
    this.score = options.score;
  };

  _.extend(Breakout.Game.prototype, {
    runtimeOptions: {ms: 1000/60},

    activate: function () {
      if (this.scheduler) return;
      this.scheduler = setInterval( this.frame.bind(this), this.runtimeOptions.ms);
    },

    allObjects: function () {
      return _(this.bricks.concat(this.balls.flatten()).concat(this.paddle) );
    },

    deactivate: function () {
      clearInterval(this.scheduler);
      this.scheduler = null;
    },

    draw: function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.allObjects().each( function (brick) { brick.draw(); } );

      this.drawScore();
    },

    drawScore: function () {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#FF0";
      ctx.fillText("Score: "+ this.score, 8, 20);
    },

    removeBrick: function (brick) {
      var idx = this.bricks.indexOf(brick);
      if (idx >= 0) this.bricks.splice(idx, 1);
    },

    checkCollision: function () {
      this.balls.each( function (ball) {
        var removes = _([]);
        this.paddle.checkCollision(ball);

        this.bricks.each( function (brick) {
          if (brick.checkCollision(ball)) removes.push(brick);
        }.bind(this) );
      this.score += removes.size();
      removes.each( this.removeBrick.bind(this) );
    }.bind(this));

    },

    frame: function () {
      this.move();
      this.draw();
      this.checkCollision();
    },

    move: function () {
      var runtimeOptions = this.runtimeOptions;
      this.allObjects().each( function (obj) {
        if (typeof obj.move !== "function") {debugger}
        obj.move(runtimeOptions.ms);
      });
    }
  });
})();

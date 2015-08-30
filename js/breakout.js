!(function () {
  if (typeof window.Breakout === "undefined") {
    window.Breakout = {};
  }

  /**
  * by default, time is measured in ms.
  *  for readability reasons, speed is in pixel per s, and,
  *  this code will utilize time / 1000
  */

  Breakout.Game = function (options) {
    options = _.extend({
      lives: 3,
      paddle: new Breakout.Paddle ({}),
      bricks: new Breakout.BrickField(),
      balls: _([]),
      score: 0,
      level: 1,
    }, options);

    this.lives = options.lives;
    this.paddle = options.paddle;
    this.bricks = options.bricks;
    this.balls = options.balls;
    this.score = options.score;
    this.runtimeOptions = {
      ms: 1000/180,
      render: 0,
      renderRatio: 3,
      accel: 1,
      difficulty: options.difficulty || 0.9,
    };
    this.runActivate();
  };

  _.extend(Breakout.Game.prototype, {

    allObjects: function () {
      return _(this.bricks.concat(this.balls.flatten()).concat(this.paddle) );
    },

    checkGameLogics: function () {
      if (this.balls.size() || this.paddle.ball) {
        var deadBalls = _(this.balls.filter( function (ball) {
          return ball.y > canvas.height;
        }));
        this.removeItemsFrom(deadBalls, this.balls);
      } else if (this.lives) {
        this.runtimeOptions.accel = 1;
        this.lives--;
        this.paddle.ball = (new Breakout.CircularElement());
      } else {
        return false;
      }

      return true;
    },

    runActivate: function () {
      if (this.scheduler) return;
      this.scheduler = setInterval( this.frame.bind(this), this.runtimeOptions.ms);
    },

    runDeactivate: function () {
      clearInterval(this.scheduler);
      this.scheduler = null;
    },

    draw: function () {
      this.runtimeOptions.render = (this.runtimeOptions.render + 1) % this.runtimeOptions.renderRatio;
      if (this.runtimeOptions.render) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.allObjects().each( function (brick) { brick.draw(); } );

      this.drawStats();
    },

    drawStats: function () {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#FF0";
      ctx.fillText("Score: "+ this.score, 8, 20);
      ctx.fillText("Lives: "+ this.lives, 100, 20);
      if (this.runtimeOptions.accel !== 1) {
        var factor = (this.runtimeOptions.accel).toFixed(2);
        ctx.fillText("Accelerated by: " + factor + "x" , 225, 20);
      }
    },

    keyDownCodeHandler: function (keyCode) {
      if  (keyCode === 68 || keyCode === 70) { //D or F
        this.speedModify(keyCode - 69);
      } else if (keyCode === 32 && this.paddle.ball) {
        this.releaseBall();
      } else {
        this.paddle.keyDownCodeHandler(keyCode);
      }
    },

    keyUpCodeHandler: function (keyCode) {
      this.paddle.keyUpCodeHandler(keyCode);
    },

    releaseBall: function () {
      this.paddle.ball.normalizeSpeed();
      this.balls.push(this.paddle.ball);
      this.paddle.ball = null;
    },

    removeItemsFrom: function (items, collection) {
      items.each( function (item) {
        var idx = collection.indexOf(item);
        if (idx >= 0) collection.splice(idx, 1);
      });
    },

    checkCollision: function () {
      this.balls.each( function (ball) {
        this.paddle.checkCollision(ball);

        var brokenBricks = _(this.bricks.filter( function (brick) {
          return brick.checkCollision(ball);
        }));
        if (brokenBricks.size()) {
          this.score += brokenBricks.size();
          if (this.runtimeOptions.difficulty < 2.0) this.runtimeOptions.difficulty *= 1.01;
          this.removeItemsFrom(brokenBricks, this.bricks);
        }
      }.bind(this));
    },

    frame: function () {
      if (this.checkGameLogics()) {
        this.move();
        this.draw();
        this.checkCollision();
      }
    },

    move: function () {
      var runtimeOptions = this.runtimeOptions;
      this.allObjects().each( function (obj) {
        obj.move(runtimeOptions);
      });
    },

    speedModify: function (val) {
      //should accept only +1 / -1
      var modification = val / 4;
      this.runtimeOptions.accel = (this.runtimeOptions.accel + modification);
      this.runtimeOptions.accel = Math.max(1, Math.min(2, this.runtimeOptions.accel));
    },
  });
})();

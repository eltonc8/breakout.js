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
      powerUps: _([]),
      score: 0,
      level: 1,
    }, options);

    this.initialize(options);
  };

  _.extend(Breakout.Game.prototype, {
    initialize: function (options) {
      this.lives = options.lives;
      this.paddle = options.paddle;
      this.bricks = options.bricks;
      this.balls = options.balls;
      this.powerUps = options.powerUps;
      this.score = options.score;
      this.runtimeOptions = {
        ms: 1000/180,
        render: 0,
        renderRatio: 3,
        accel: 1,
        difficulty: options.difficulty || 0.9,
      };

      this.addPowerUps();
      this.runActivate();
    },

    addPowerUps: function () {
      var modBrick, options;
      this.bricks = this.bricks.shuffle();
      for (i = 0; i < this.bricks.length / 20; i++) {
        modBrick = this.bricks.pop();
        modBrick.addPowerUps({ degree: 120 * (i % 4) });
        this.bricks.unshift(modBrick);
      }
      this.bricks = _(this.bricks);
    },

    ballFire: function () {
      if ( !this.paddle.ball ) return;
      this.paddle.ball.normalizeSpeed();
      this.balls.push( this.paddle.ball );
      this.paddle.ball = null;
    },

    ballLoad: function () {
        this.paddle.ball = (new Breakout.CircularElement());
    },

    checkCollisions: function () {
      this._circularObjs().each( function (ball) {
        if ( this.paddle.checkCollision(ball) && ball.isPowerUp ) {
          ball.effect().call(this);
          this.removeItemsFrom( _([ball]), this.powerUps );
          return;
        }
        if (ball.isPowerUp) return;

        var brokenBricks = _(this.bricks.filter( function (brick) {
          if (brick.checkCollision(ball)) {
            if (brick.powerUp) this.powerUps.push(brick.powerUp);
            return true;
          }
        }.bind(this)));
        if (brokenBricks.size()) {
          this.score += brokenBricks.size();
          if (this.runtimeOptions.difficulty < 2.0) this.runtimeOptions.difficulty *= 1.01;
          this.removeItemsFrom(brokenBricks, this.bricks);
        }
      }.bind(this));
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
        this.ballLoad();
      } else {
        return false;
      }

      return true;
    },

    draw: function () {
      this.runtimeOptions.render = (this.runtimeOptions.render + 1) % this.runtimeOptions.renderRatio;
      if (this.runtimeOptions.render) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this._allObjects().each( function (brick) { brick.draw(); } );

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

    frame: function () {
      if ( !this.bricks.size() ) {
        this.gameEnd(true);
      } else if (this.checkGameLogics()) {
        this.move();
        this.draw();
        this.checkCollisions();
      } else {
        this.gameEnd();
      }
    },

    gameEnd: function (won) {
      ctx.font = "16px Arial";
      ctx.fillStyle = new Date() / 1000 % 2 < 1 ? "#0F0" : "#F00";
      if (won) {
        ctx.fillText("YOU WON!", 260, 300);
      } else {
        ctx.fillText("GAME OVER", 250, 300);
      }
    },

    keyDownCodeHandler: function (keyCode) {
      if  (keyCode === 68 || keyCode === 70) { //D or F
        this.speedModify(keyCode - 69);
      } else if (keyCode === 32 && this.paddle.ball) {
        this.ballFire();
      } else {
        this.paddle.keyDownCodeHandler(keyCode);
      }
    },

    keyUpCodeHandler: function (keyCode) {
      this.paddle.keyUpCodeHandler(keyCode);
    },

    move: function () {
      var runtimeOptions = this.runtimeOptions;
      this._allObjects().each( function (obj) {
        obj.move(runtimeOptions);
      });
    },

    mouseMoveHandler: function (relativeX) {
      this.paddle.mouseMoveHandler(relativeX);
    },

    removeItemsFrom: function (items, collection) {
      items.each( function (item) {
        var idx = collection.indexOf(item);
        if (idx >= 0) collection.splice(idx, 1);
      });
    },

    runActivate: function () {
      if (this.scheduler) return;
      this.scheduler = setInterval( this.frame.bind(this), this.runtimeOptions.ms);
    },

    runDeactivate: function () {
      clearInterval(this.scheduler);
      this.scheduler = null;
    },

    speedModify: function (val) {
      //should accept only +1 / -1
      var modification = val / 4;
      this.runtimeOptions.accel = (this.runtimeOptions.accel + modification);
      this.runtimeOptions.accel = Math.max(1, Math.min(2, this.runtimeOptions.accel));
    },

    _allObjects: function () {
      return _( this.bricks.concat(this.paddle).concat(this._circularObjs().flatten()) );
    },

    _circularObjs: function () {
      return _( this.balls.concat(this.powerUps.flatten()) );
    },
  });
})();

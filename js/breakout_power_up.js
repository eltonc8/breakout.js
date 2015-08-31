!(function () {
  if (typeof window.Breakout === "undefined") {
    window.Breakout = {};
  }

  PowerUp = Breakout.PowerUp = function (options) {
    this.fixed = (options && options.degree) / 180 * Math.PI;
    options = _.extend({
      degree: Math.floor( Math.random() * 360),
      dx: 0,
      dy: 100,
      radius: 5,
    }, options);
    this.tick = -1;
    this.degree = options.degree;
    this.initialize(options);
  };

  Breakout.setInheritance(PowerUp, Breakout.CircularElement);

  _.extend(PowerUp.prototype, {
    effect: function () {
      var value = ( this.fixed / Math.PI * 180 || this.degree || 0 ) + 60 ;
      value /= 120;

      switch ( Math.floor(value % 3) ) {
        case 0:
          return this._extraBall;
        case 1:
          return this._extraLife;
        default:
          return this._extendPaddle;
      }
    },

    _extraBall: function () {
      this.ballLoad();
      setTimeout( this.ballFire.bind(this), 2000 );
    },

    _extraLife: function () {
      this.lives += 1;
    },

    _extendPaddle: function () {
      this.paddle.extendInitiate();
    },

    isPowerUp: true,

    powerUpEffect: function (brick) {
      this.degree = (this.degree + 1) % 360;
      this.tick = (this.tick + 1) % 4; //computation reduction
      if (this.tick) return;

      var red, green, blue, radian;
      radian = this.degree / 180 * Math.PI;
      if (this.fixed) radian = (Math.cos(radian)) * Math.PI/4 + this.fixed;

      red   = 255 / 2 * (1 + Math.cos( radian ) );
      green = 255 / 2 * (1 + Math.cos( radian + Math.PI * 2/3) );
      blue  = 255 / 2 * (1 + Math.cos( radian + Math.PI * 4/3) );
      brick.color = this.color = "#" + hex(red) + hex(green) + hex(blue);
    }
  });
})();

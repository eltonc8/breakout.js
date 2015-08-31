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
      return;
    },
    
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

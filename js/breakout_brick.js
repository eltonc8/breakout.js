!(function () {
  if (typeof window.Breakout === "undefined") {
    window.Breakout = {};
  }

  var RectElement = Breakout.RectElement;

  var Brick = Breakout.Brick = function (options) {
    options = _.extend({x: 0, y: 0, dx: 0, width: 100, height: 10, color: "#0F0"}, options);
    this.initialize(options);
    this.thrust = 0;
  };

  Breakout.setInheritance(Brick, RectElement);

  _.extend(Brick.prototype, {
    frame: function (options) {
      this.draw();
      if (this.checkCollision(Breakout.ball)) this.remove();
    },

    remove: function () {
      var idx = Breakout.bricks.indexOf(this);
      if (idx >= 0) Breakout.bricks.splice(idx, 1);
    }
  });

  Breakout.BrickField = function (options) {
    options = _.extend({
      wall_padding: 30,
      brick_padding: 5,
      col_count: 12,
      row_count: 6,
      height: 10,
    }, options);
    options.width = canvas.width - (2 * options.wall_padding) - (options.col_count - 1) * options.brick_padding;
    options.width = options.width / options.col_count;
    var x, y;
    for (c = 0; c < options.col_count; c++) {
      for (r = 0; r < options.row_count; r++) {
        options.x = options.wall_padding + c * (options.width + options.brick_padding);
        options.y = options.wall_padding + r * (options.height + options.brick_padding);
        Breakout.bricks.push( new Brick(options) );
      }
    }
  };
})();

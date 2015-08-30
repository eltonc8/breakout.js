!(function () {
  if (typeof window.Breakout === "undefined") {
    window.Breakout = {};
  }

  var RectElement = Breakout.RectElement;

  var Brick = Breakout.Brick = function (options) {
    options = _.extend({x: 0, y: 0, dx: 0, width: 100, height: 10, color: "#0F0"}, options);
    this.initialize(options);
  };

  Breakout.setInheritance(Brick, RectElement);

  _.extend(Brick.prototype, {});

  BrickField = Breakout.BrickField = function (options) {
    options = _.extend({
      wall_padding: 30,
      brick_padding: 5,
      col_count: 12,
      row_count: 6,
      height: 10,
      pattern: this.classicRainbow.bind(this),
      set: _([]),
    }, options);
    options.width = canvas.width - (2 * options.wall_padding)
                    - (options.col_count - 1) * options.brick_padding;
    options.width = options.width / options.col_count;

    for (c = 0; c < options.col_count; c++) {
      for (r = 0; r < options.row_count; r++) {
        if (options.pattern) options.pattern(options, r, c);
        if (options.skip) continue;
        options.x = options.wall_padding + c * (options.width + options.brick_padding);
        options.y = options.wall_padding + r * (options.height + options.brick_padding);
        options.set.push( new Brick(options) );
      }
    }

    return options.set;
  };

  _.extend(BrickField.prototype, {
    classicRainbow: function (options, r, c) {
      var period = 2 * Math.PI / options.row_count ;
      var red   = 255 / 2 * (1 + Math.cos( r * period ) );
      var green = 255 / 2 * (1 + Math.cos( r * period + Math.PI * 4 / 3) );
      var blue  = 255 / 2 * (1 + Math.cos( r * period + Math.PI * 2 / 3) );
      options.color = "#" + hex(red) + hex(green) + hex(blue);
    },
  });
})();



if (typeof window.Breakout === "undefined") {
  window.Breakout = {};
}

/*
* by default, time is measured in ms.
*  for readability reasons, speed is in pixel per s, and,
*  this code will utilize time / 1000
*/

var CircularElement = Breakout.CircularElement;
var RectElement = Breakout.RectElement;
var BrickField = Breakout.BrickField;
var Paddle = Breakout.Paddle;

var ball = Breakout.ball = new CircularElement ({x: 20, y: 20, dx: 100, dy: 100});
Breakout.paddle = new Paddle ({});
Breakout.bricks = _([]);

new BrickField({col_count: 12, row_count: 4,});

var time = {time: 1000/60};

Breakout.scheduler = function () {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  Breakout.ball.frame(time);
  Breakout.bricks.each(function (brick) {brick.frame(time);});
  Breakout.paddle.frame(time);
  Breakout.paddle.checkCollision(ball);
};

Breakout.schedule = setInterval( Breakout.scheduler, time.time);

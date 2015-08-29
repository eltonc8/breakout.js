- [live demo](https://eltonc88.github.io/breakout.js)
- [inspiration](https://en.wikipedia.org/wiki/Breakout_(video_game))

This is an implementation of the classic Breakout game, built on Javascript, jQuery with Underscore.js library.

Some highlights:
* Game is implemented with physics-engine.
* Paddle has smooth acceleration and deceleration.
* Paddle can impart momentum onto the ball based on the speed of the paddle.
* Ball-object collisions are calculated with vector algebra, resulting in realistic reflections at the corner.
* Game mechanics are calculated at 3x graphics refresh rate to improve calculation accuracy.

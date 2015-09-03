# Breakout!

An implementation of the classic Breakout game, built on Javascript, HTML5 canvas, and jQuery with Underscore.js library.

- [live demo](https://eltonc88.github.io/breakout.js)
- [inspiration](https://en.wikipedia.org/wiki/Breakout_(video_game))

![Elton's Breakout.js](https://raw.githubusercontent.com/eltonc88/breakout.js/master/img/image.png)

### Highlights:

* Game is implemented with physics-engine to provide a rich experience.
* Paddle has smooth acceleration and deceleration, with two control methods:
  * Left/right buttons.
  * Mouse control
* Paddle can impart momentum onto the ball based on the speed of the paddle.
* Ball-object collisions are calculated with vector algebra, resulting in realistic reflections at the corners.
* Game mechanics are optimized for user experience, calculated at 3x graphics refresh rate to improve calculation accuracy.
* Underlying code is beautifully organized into subclasses and reused, providing DRY and effective code.


## Physics-engine

### Paddle
The position of the paddle is calculated based on acceleration per unit time (v = at). As a result, user experience smooth and continuous movements of the paddle, providing realistic but at-times-challenging feeling of momentum.

The mouse provides an intuitive method to control the paddle. While the game limits maximum acceleration and speed, calculations are made for the user to decelerate the paddle to the position of the mouse. However, the user can also use the arrow keys for a greater challenge.

### Ball
The ball intuitively responds to paddle and bricks in two ways. Empowered by thoughtful equations, the game provides a rich environment where the user and game elements can interact in a responsive environment where minute details matter.

#### Corner bounces
Ball bounces at the corners provide an interesting and at-times challenging experience. The physics-engine provides realistic experience by calculating the normal at which a ball strikes a corner or a surface. Fitting usage of vector and dot product allow the game to model real-life physics.

#### Paddle momentum
The game empower the user to finely tune the movement of the ball in a realistic manner by calculating an interaction between the ball and the momentum of the paddle. This allows the user to enjoy a challenging, yet intuitive and rich experience of controlling the moveable elements of the game.

## Mathematics
Trigonometry functions are used to provide a beautiful presentation. Power-ups are represented with bricks whose color changes along a continuous spectrum of colors, while the launch mechanics models the periodical swings of a pendulum. All of these elements provide users with a wealthy visual experience.

## Refresh rate and performance

The game has been optimized for user experience. The underlying mechanics are calculated at 180 frames per second while the canvas is refreshed at 60 fames per second, providing improved fidelity of game mechanics while the user enjoy smooth and updated graphics.

## Organized Code

Underlying code is beautifully organized into classes. Usage of class is an effective application of the principle "Don't Repeat Yourself" or DRY code. Elements with similar behaviors share identical methods via inheritance of prototype methods. Both the bricks and paddle share collision calculations while the balls and power-up elements opportunistically share common methods and behaviors. Usage of the Underscore.js library also visually improve the visual presentation of the code, making method definition more effective with fewer words. Such designs provide easier code-reading experiences and permit more effective addition of new features. ... and more features may be implemented in the future!

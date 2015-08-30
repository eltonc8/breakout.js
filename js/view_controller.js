!(function () {
  if (typeof window.Breakout === "undefined") {
    window.Breakout = {};
  }

  Breakout.View = function () {
    $(".new-game"       ).on("click", this.newGame.bind(this));
    $(".pause-toggle"   ).on("click", this.pauseToggle.bind(this));
    $(".power-up-toggle").on("click", this.powerUpToggle.bind(this));

    jQuery(document).on("keydown", this.keyDownHandler.bind(this));
    jQuery(document).on("keyup", this.keyUpHandler.bind(this));

    this.newGame();
  };

  _.extend(Breakout.View.prototype, {
    //these two key handlers exists on the top view to avoid repeated creation
    // of new key handlers in new games.
    keyDownHandler: function (event) {
      if (event.keyCode === 78) { //N
        this.newGame();
      } else if (event.keyCode === 80) { //P
        this.pauseToggle();
      } else {
        this.game && this.game.keyDownHandler(event);
      }
    },

    keyUpHandler: function (event) {
      this.game && this.game.keyUpHandler(event);
    },

    newGame: function () {
      if (this.game) { this.game.runDeactivate(); }
      this.game = new Breakout.Game({});
      this.pauseToggle(true, true);
    },

    pauseToggle: function (event, reset) {
      if (reset || $(".pause-toggle").html() == "Resume [P]") {
        $(".pause-toggle").html("Pause [P]");
        this.game.runActivate();
      } else {
        $(".pause-toggle").html("Resume [P]");
        this.game.runDeactivate();
      }
    },

    powerUpToggle: function (event) {
      if ($(".power-up-toggle").html().match("Include Power-Ups!")) {
        $(".power-up-toggle").html("Play simple!");
        // TODO
      } else {
        $(".power-up-toggle").html("Include Power-Ups!");
        // TODO
      }
    },
  });

})();

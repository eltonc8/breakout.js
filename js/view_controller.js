!(function () {
  if (typeof window.Breakout === "undefined") {
    window.Breakout = {};
  }

  Breakout.View = function () {
    $(".new-game").on("click", this.newGame.bind(this));
    $(".pause-toggle").on("click", this.pauseToggle.bind(this));
    this.newGame();
  };

  _.extend(Breakout.View.prototype, {
    newGame: function () {
      if (this.game) { this.game.deactivate(); }
      this.game = new Breakout.Game({});
    },

    pauseToggle: function (event) {
      if ($(".pause-toggle").html().match("Pause")) {
        $(".pause-toggle").html("Restart");
        this.game.deactivate();
      } else {
        $(".pause-toggle").html("Pause");
        this.game.activate();
      }
    },
  });

})();

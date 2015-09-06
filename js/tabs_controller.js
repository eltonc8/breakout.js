!(function () {
  if (typeof window.Breakout === "undefined") {
    window.Breakout = {};
  }

  Breakout.Tabs = function () {
    $(".labels").delegate("label", "mouseover", this.switchTabs.bind(this));
    this.idx = -1;
    this.scope = $(".labels").children();
    this.limit = this.scope.length;
    this.schedule();
  },

  _.extend(Breakout.Tabs.prototype, {
    switchTabs: function (event) {
      this.manual = true;
      event.currentTarget.click();
    },

    schedule: function () {
      if (this.manual) return;
      this.idx = (this.idx + 1) % this.limit;
      this.scope[this.idx].click();
      setTimeout( this.schedule.bind(this), 5000);
    },
  });
})();

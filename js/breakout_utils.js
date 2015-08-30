!(function () {
  if (typeof window.Breakout === "undefined") {
    window.Breakout = {};
  }

  Breakout.setInheritance = function (childClass, parentClass) {
    function Surrogate () {}
    Surrogate.prototype = parentClass.prototype;
    childClass.prototype = new Surrogate();
    childClass.prototype.constructor = childClass;
    childClass.prototype.superClass = childClass.prototype.__proto__;
  };

  window.hex = function (num) {
    num = Math.max(0, Math.min(255, num) );
    var result = "00" + Number( Math.floor(num) ).toString(16);
    return result.slice(-2);
  };
})();

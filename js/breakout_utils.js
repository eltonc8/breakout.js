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

})();

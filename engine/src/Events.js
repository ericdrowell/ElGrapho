let Events = function() {

};

Events.prototype = {
  funcs: {},
  on: function(name, func) {
    if (!this.funcs[name]) {
      this.funcs[name] = [];
    }

    this.funcs[name].push(func);
  },
  fire: function(name, evt) {
    if (this.funcs[name]) {
      this.funcs[name].forEach(function(f) {
        f(evt);
      });
    }
  }
};

module.exports = Events;
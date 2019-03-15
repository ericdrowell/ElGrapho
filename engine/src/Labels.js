let Labels = function() {
  this.labelsAdded = [];
};

Labels.prototype = {
  clear: function() {
    this.labelsAdded = [];
  },
  addLabel: function(str, x, y) {
    // TODO: add logic to filter out overlapped labels
    this.labelsAdded.push({ 
      str: str,
      x: x,
      y: y,
      width: 100,
      height: 10
    });
  }
};

module.exports = Labels;
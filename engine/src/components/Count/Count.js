const NumberFormatter = require('../../formatters/NumberFormatter');

const Count = function(config) {
  let wrapper = this.wrapper = document.createElement('span');
  let container = config.container;

  container.appendChild(wrapper);
};

Count.prototype = {
  update: function(model) {
    let pointCount = model.nodes.xs.length;
    let edgeCount = model.edges.from.length;
    let steps = model.steps;
  
    this.wrapper.innerHTML = NumberFormatter.addCommas(pointCount) + ' points + ' + NumberFormatter.addCommas(edgeCount) + ' edges' + ' x ' + steps + ' steps';
    this.wrapper.className = 'el-grapho-count';
  }
};

module.exports = Count;
const NumberFormatter = require('../../formatters/NumberFormatter');

const Count = function(config) {
  let wrapper = this.wrapper = document.createElement('span');
  let container = config.container;

  container.appendChild(wrapper);
};

Count.prototype = {
  update: function(nodeCount, edgeCount, steps) {
    this.wrapper.innerHTML = NumberFormatter.addCommas(nodeCount) + ' nodes + ' + NumberFormatter.addCommas(edgeCount) + ' edges' + ' x ' + steps + ' steps';
    this.wrapper.className = 'el-grapho-count';
  }
};

module.exports = Count;
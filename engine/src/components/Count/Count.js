const NumberFormatter = require('../../formatters/NumberFormatter');

const Count = function(config) {
  let wrapper = this.wrapper = document.createElement('span');
  let container = config.container;

  container.appendChild(wrapper);
};

Count.prototype = {
  update: function(nodeCount, edgeCount, steps) {
    let nodesAndEdgesStr = NumberFormatter.addCommas(nodeCount) + ' nodes + ' + NumberFormatter.addCommas(edgeCount) + ' edges';
    let stepsStr = steps === undefined ? '' : ' x ' + steps + ' steps';
    this.wrapper.innerHTML = nodesAndEdgesStr + stepsStr;
    this.wrapper.className = 'el-grapho-count';
  }
};

module.exports = Count;
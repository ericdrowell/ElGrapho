const fitToViewport = require('./utils/fitToViewport');
const buildTreeLevels = require('./utils/buildTreeLevels');

const RadialTree = function(model) {
  let treeLevels = buildTreeLevels(model);
  let numLevels = treeLevels.length;

  // O(n)
  treeLevels.forEach(function(nodes, level) {
    nodes.forEach(function(node) {
      let n = node.index;
      let angle = Math.PI * node.pos;
      let radius = level / (numLevels-1);
      model.nodes[n].x = radius * Math.cos(angle);
      model.nodes[n].y = radius * Math.sin(angle);
    });
  });

  fitToViewport(model.nodes);

  return model;
};

module.exports = RadialTree;
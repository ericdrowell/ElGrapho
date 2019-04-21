//const fitToViewport = require('./utils/fitToViewport');
const buildTreeLevels = require('./utils/buildTreeLevels');

const RadialTree = function(model) {
  let treeLevels = buildTreeLevels(model);

  treeLevels.forEach(function(nodes, level) {
    let radius = level === 0 ? 0 : 1 - Math.pow(0.9, level);

    nodes.forEach(function(node) {
      let n = node.index;
      let angle = Math.PI * node.pos;
     
      model.nodes[n].x = radius * Math.cos(angle);
      model.nodes[n].y = radius * Math.sin(angle);
    });
  });

  //fitToViewport(model.nodes, false);

  return model;
};

module.exports = RadialTree;
const fitToViewport = require('./utils/fitToViewport');
const buildTreeLevels = require('./utils/buildTreeLevels');

const Tree = function(model) {
  let treeLevels = buildTreeLevels(model);
  let numLevels = treeLevels.length;

  let maxDist = Math.pow(1.3, treeLevels.length-1);

  // O(n)
  treeLevels.forEach(function(nodes, level) {
    nodes.forEach(function(node) {
      let n = node.index;
      let dist = (Math.pow(1.3, numLevels - level)) / maxDist;

      model.nodes[n].x = node.pos;
      //model.nodes[n].y = 1 - (2 * (level / (numLevels - 1)));
      model.nodes[n].y = dist;
    });
  });

  fitToViewport(model.nodes, false);

  return model;
};

module.exports = Tree;
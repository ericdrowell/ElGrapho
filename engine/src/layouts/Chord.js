const fitToViewport = require('./utils/fitToViewport');

const Chord = function(model) {
  let numNodes = model.nodes.length;
  model.nodes.forEach(function(node, n) {
    let angle = (-1*Math.PI*2*n / numNodes) + Math.PI/2;
    node.x = Math.cos(angle);
    node.y = Math.sin(angle);
  });

  fitToViewport(model.nodes);

  return model;
};

module.exports = Chord;
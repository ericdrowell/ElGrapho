const fitToViewport = require('./utils/fitToViewport');

const Ring = function(config) {
  let numNodes = config.nodes.colors.length;

  let model = {
    nodes: {
      xs: [],
      ys: [],
      colors: config.nodes.colors.slice()
    },
    edges: {
      from: config.edges.from.slice(),
      to: config.edges.to.slice()
    },
    width: config.width,
    height: config.height
  };

  for (let n=0; n<numNodes; n++) {
    let angle = (-1*Math.PI*2*n / numNodes) + Math.PI/2;
    model.nodes.xs.push(Math.cos(angle));
    model.nodes.ys.push(Math.sin(angle));
  }

  fitToViewport(model.nodes);

  return model;
};

module.exports = Ring;
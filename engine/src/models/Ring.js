const Ring = function(config) {
  let numNodes = config.nodes.colors.length;

  let model = {
    nodes: {
      xs:     [],
      ys:     [],
      colors: []
    },
    edges: [], 
    width: config.width,
    height: config.height
  };

  // TODO: need to sort colors first and shuffle edges
  model.nodes.colors = config.nodes.colors;
  model.edges = config.edges;

  for (let n=0; n<numNodes; n++) {
    let angle = Math.PI*2*n / numNodes;
    model.nodes.xs.push(Math.cos(angle));
    model.nodes.ys.push(Math.sin(angle));
  }

  return model;
};

module.exports = Ring;
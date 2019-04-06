const fitToViewport = require('./utils/fitToViewport');
const d3 = require('d3-force');
const DEFAULT_STEPS = 30;

const ForceDirected = function(model) {
  if (model.steps === undefined) {
    model.steps = DEFAULT_STEPS;
  }

  let nodes = [];
  let links = [];

  model.nodes.forEach(function(node, n) {
    nodes.push({
      id: n,
      group: node.group
    });
  });

  model.edges.forEach(function(edge) {
    links.push({
      source: edge.from,
      target: edge.to
    });
  });

  // https://www.npmjs.com/package/d3-force
  var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody())
    .force('link', d3.forceLink(links).distance(20).strength(1)) 
    .force('x', d3.forceX())
    .force('y', d3.forceY());

  simulation.tick(model.steps);
  simulation.stop();

  simulation.nodes().forEach(function(node, n) {
    model.nodes[n].x = node.x;
    model.nodes[n].y = node.y;
  });

  fitToViewport(model.nodes, false);

  return model;
};

module.exports = ForceDirected;
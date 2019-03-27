const fitToViewport = require('./utils/fitToViewport');
const d3 = require('d3-force');

const DEFAULT_STEPS = 30;

const ForceDirected = function(model) {
  if (model.steps === undefined) {
    model.steps = DEFAULT_STEPS;
  }

  // convert to webcola schema
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

  let simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody())
    .force("link", d3.forceLink(links))
    .force("center", d3.forceCenter());

  simulation.tick(model.steps);
  simulation.stop();

  simulation.nodes().forEach(function(node, n) {
    model.nodes[n].x = node.x;
    model.nodes[n].y = node.y;
  });

  fitToViewport(model.nodes);

  return model;
};

module.exports = ForceDirected;
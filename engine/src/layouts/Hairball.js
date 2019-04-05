const fitToViewport = require('./utils/fitToViewport');
const DEFAULT_STEPS = 20;
const POSITION_FACTOR = 0.3;
const ATTRACT_FACTOR = 0.1;

const initNodePositions = function(nodes) {
  let numNodes = nodes.length;

  // find group counts
  let groups = [];
  nodes.forEach(function(node) {
    let group = node.group;

    if (groups[group] === undefined) {
      groups[group] = {
        count: 0
      };
    }

    groups[group].count++;
  });

  let total = 0;
  for (let n=0; n<groups.length; n++) {
    groups[n].next = total;
    total+=groups[n].count;
  }

  // initialize positions
  nodes.forEach(function(node) {
    let group = node.group;
    let angle = -2 * Math.PI * groups[group].next++ / numNodes;

    node.x = POSITION_FACTOR * Math.cos(angle);
    node.y = POSITION_FACTOR * Math.sin(angle);
  });
};

// attractive forces between nodes sharing an edge
// Hooke's Law -> F = kx
const attractNodes = function(nodes, edges) {
  edges.forEach(function(edge) {
    let a = edge.from;
    let b = edge.to;

    let ax = nodes[a].x;
    let ay = nodes[a].y;
    let bx = nodes[b].x;
    let by = nodes[b].y;
    let xDiff = bx - ax;
    let yDiff = by - ay;
    let dist = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

    let xChange, yChange;

    if (dist > 0) {
      xChange = ATTRACT_FACTOR * xDiff;
      yChange = ATTRACT_FACTOR * yDiff;

      // move a closer to b
      nodes[a].x += xChange;
      nodes[a].y += yChange;

      // move b closer to a
      nodes[b].x -= xChange;
      nodes[b].y -= yChange;
    }
  });
};

const Hairball = function(model) {
  if (model.steps === undefined) {
    model.steps = DEFAULT_STEPS;
  }

  let nodes = model.nodes;
  let edges = model.edges;

  initNodePositions(nodes);

  // process steps
  for (let n=1; n<model.steps; n++) {
    attractNodes(nodes, edges);
  }

  fitToViewport(nodes);

  return model;
};

module.exports = Hairball;
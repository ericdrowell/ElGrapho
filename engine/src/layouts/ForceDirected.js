// const fitToViewport = require('./utils/fitToViewport');
// const d3 = require('d3-force');
// const cluster = require('d3-force-cluster');

// const DEFAULT_STEPS = 30;

// const ForceDirected = function(model) {
//   if (model.steps === undefined) {
//     model.steps = DEFAULT_STEPS;
//   }

//   // convert to d3-force schema
//   let nodes = [];
//   let links = [];

//   model.nodes.forEach(function(node, n) {
//     nodes.push({
//       id: n,
//       group: node.group
//     });
//   });

//   model.edges.forEach(function(edge) {
//     links.push({
//       source: edge.from,
//       target: edge.to
//     });
//   });

//   // https://www.npmjs.com/package/d3-force
//   // https://observablehq.com/@mbostock/clustered-bubbles-2
//   let simulation = d3.forceSimulation(nodes)
    
    
//     .force('charge', d3.forceManyBody())
//     .force('link', d3.forceLink(links).distance(20))
//     .force("cluster", cluster.forceCluster())
//     .force("collide", d3.forceCollide())
//     .force('center', d3.forceCenter());

//   simulation.tick(model.steps);
//   simulation.stop();

//   simulation.nodes().forEach(function(node, n) {
//     model.nodes[n].x = node.x;
//     model.nodes[n].y = node.y;
//   });

//   fitToViewport(model.nodes);

//   return model;
// };

// module.exports = ForceDirected;


const fitToViewport = require('./utils/fitToViewport');
const cola = require('webcola');

const DEFAULT_STEPS = 30;

const ForceDirected = function(model) {
  if (model.steps === undefined) {
    model.steps = DEFAULT_STEPS;
  }

  let nodes = [];
  let links = [];

  model.nodes.forEach(function(node) {
    nodes.push({
      group: node.group
    });
  });

  model.edges.forEach(function(edge) {
    links.push({
      source: edge.from,
      target: edge.to
    });
  });

  let promise = new Promise((resolve/*, reject*/) => {
    let onStart = () => {
      //console.log('start');
    };

    let onTick = () => {
      //console.log('tick');
    };

    let onEnd = () => {
      //console.log('end');
      layout.nodes().forEach(function(node, n) {
        model.nodes[n].x = node.x;
        model.nodes[n].y = node.y;
      });

      fitToViewport(model.nodes);

      resolve(model);
    };

    // https://github.com/tgdwyer/WebCola/issues/230
    const nodeSize = 20/*, threshold = 0.01*/; 
     let layout = new cola.Layout() 
       .nodes(nodes)
       .links(links) 
       .jaccardLinkLengths(40,0.7)
       .start(model.steps)
       .on(cola.EventType.start, onStart) 
       .on(cola.EventType.tick, onTick) 
       .on(cola.EventType.end, onEnd); 
     layout.nodes().forEach(v=>v.width = v.height = nodeSize); // square nodes 
     layout.start(); // first layout 
  });

  return promise;
};

module.exports = ForceDirected;
const fitToViewport = require('./utils/fitToViewport');
const cola = require('webcola');

//const DEFAULT_STEPS = 20;

const ForceDirectedGraph = function(model) {
  console.log(cola);
  //let steps = model.steps === undefined ? DEFAULT_STEPS : model.steps;
  // let nodes = model.nodes;
  // let edges = model.edges;

  // let colaNodes = nodes;
  // let colaLinks = edges;

  // let d3cola = cola.d3adaptor()
  //   .linkDistance(30)
  //   .size([model.width, model.height]);

  // d3cola
  //   .nodes(colaNodes)
  //   .links(colaLinks)
  //   .constraints({

  //   })
  //   .symmetricDiffLinkLengths(5)
  //   .avoidOverlaps(true)
  //   .start(10,15,20);

  // debugger;

  // convert to webcola schema
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
      console.log('start');
    };

    let onTick = () => {
      console.log('tick');
    };

    let onEnd = () => {
      console.log('end');

      console.log(layout.nodes());

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
      //  .handleDisconnected(false) // handle disconnected repacks the components which would hide any drift 
      //  .linkDistance(1) // minimal link distance means nodes would overlap if not for... 
      //  .avoidOverlaps(true) // force non-overlap 
       .nodes(nodes)
       .links(links) 
       .jaccardLinkLengths(40,0.7)
       .start(30)


      //  .constraints([{ type: "alignment", axis: "y", 
      //      offsets: [ 
      //          { node: 0, offset: 0 }, 
      //          { node: 1, offset: 0 }, 
      //      ] 
      //  }]) 
       .on(cola.EventType.start, onStart) 
       .on(cola.EventType.tick, onTick) 
       .on(cola.EventType.end, onEnd); 
     layout.nodes().forEach(v=>v.width = v.height = nodeSize); // square nodes 
     layout.start(); // first layout 

  });


  return promise;
};

module.exports = ForceDirectedGraph;
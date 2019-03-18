const ForceDirectedGraph = function(config) {
  let numNodes = config.nodes.colors.length;
  let steps = config.steps === undefined ? 10 : config.steps;

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
    height: config.height,
    steps: steps
  };

  model.nodes.xs.length = numNodes;
  model.nodes.xs.fill(0);

  model.nodes.ys.length = numNodes;
  model.nodes.ys.fill(0);

  let nodes = model.nodes;
  let edges = model.edges;
  let numEdges = edges.from.length;

  // find color counts
  let colors = [];
  for (let a=0; a<numNodes; a++) {
    let color = nodes.colors[a];

    if (colors[color] === undefined) {
      colors[color] = {
        count: 0
      };
    }

    colors[color].count++;
  }

  let total = 0;
  for (let n=0; n<colors.length; n++) {
    colors[n].next = total;
    total+=colors[n].count;
  }

  // initialize positions
  for (let a=0; a<numNodes; a++) {
    let color = nodes.colors[a];
    let angle = -2 * Math.PI * colors[color].next++ / numNodes;

    const K = 0.3;
    nodes.xs[a] = K * Math.cos(angle);
    nodes.ys[a] = K * Math.sin(angle);
  }

  // process steps
  for (let n=1; n<steps; n++) {

    let xChanges = [];
    let yChanges = [];

    //console.log('--- step ' + n + ' ---');

    // repulsive forces for all nodes
    // Coulomb's Law -> F = q1 * q2 / d^2
    for (let a=0; a<numNodes; a++) {
      xChanges[a] = 0;
      yChanges[a] = 0;

      for (let b=0; b<numNodes; b++) {
        let ax = nodes.xs[a];
        let ay = nodes.ys[a];
        let bx = nodes.xs[b];
        let by = nodes.ys[b];
        let xDiff = bx - ax;
        let yDiff = by - ay;
        let dist = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        //let aColor = nodes.colors[a];
        //let bColor = nodes.colors[b];

        if (dist > 0) {
          // move a away from b
          // for repelling forces, the force is stronger than the distance between the nodes is small
          //let K = 10 / (numNodes * numNodes);
          let K = 0.015;

          let xChange = -1 * K * xDiff / (dist * dist);
          let yChange = -1 * K * yDiff / (dist * dist);

          xChanges[a] += xChange;
          yChanges[a] += yChange;

          // nodes.xs[a] += xChange;
          // nodes.ys[a] += yChange;
        }
      }
    }




    // attractive forces between nodes sharing an edge
    // Hooke's Law -> F = kx
    for (let i=0; i<numEdges; i++) {
      let a = edges.from[i];
      let b = edges.to[i];

      let ax = nodes.xs[a];
      let ay = nodes.ys[a];
      let bx = nodes.xs[b];
      let by = nodes.ys[b];
      let xDiff = bx - ax;
      let yDiff = by - ay;
      let dist = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

      let xChange, yChange;

      if (dist > 0) {
        // for attractive forces, the force is stronger when the nodes are farther apart
        let K = 0.5;
        xChange = K * xDiff;
        yChange = K * yDiff;

        //let changeMagnitude = Math.sqrt(xChange * xChange * yChange * yChange);

        // move a closer to b
        // nodes.xs[a] += xChange;
        // nodes.ys[a] += yChange;

        xChanges[a] += xChange;
        yChanges[a] += yChange;

        // move b closer to a
        // nodes.xs[b] -= xChange;
        // nodes.ys[b] -= yChange;

        xChanges[b] -= xChange;
        yChanges[b] -= yChange;   
      }



    }










    //debugger;

    //update node positions

    //let DAMPER = 0.2; // good for about 10 nodes
    let DAMPER = 0.01;

    for (let i=0; i<numNodes; i++) {
      nodes.xs[i] += xChanges[i] * DAMPER;
      nodes.ys[i] += yChanges[i] * DAMPER;
    }
  }


  //console.log(model);

  return model;
};

module.exports = ForceDirectedGraph;
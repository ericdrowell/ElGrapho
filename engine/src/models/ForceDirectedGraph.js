const ForceDirectedGraph = function(config) {
  let numNodes = config.nodes.colors.length;

  //let iterations = config.iterations || 1;

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

  // model.nodes.xs.length = numNodes;
  // model.nodes.xs.fill(0);

  // model.nodes.ys.length = numNodes;
  // model.nodes.ys.fill(0);

  for (let n=0; n<numNodes; n++) {
    model.nodes.xs[n] = Math.random()*2-1;
    model.nodes.ys[n] = Math.random()*2-1;
  }

  // TODO: need to sort colors first and shuffle edges
  model.nodes.colors = config.nodes.colors;
  model.edges = config.edges;

  const DIST_CHANGE = 0.05;

  for (let i=0; i<10; i++) {
    let xChanges = [];
    let yChanges = [];

    // O(n^2)
    for (let a=0; a<numNodes; a++) {
      xChanges[a] = 0;
      yChanges[a] = 0;

      for (let b=0; b<numNodes; b++) {
        let aX = model.nodes.xs[a];
        let aY = model.nodes.ys[a];
        let bX = model.nodes.xs[b];
        let bY = model.nodes.ys[b];
        let aColor = model.nodes.colors[a];
        let bColor = model.nodes.colors[b];
        // let aWeight = config.nodes.weights[a];
        // let bWeight = config.nodes.weights[b];
        let xDiff = bX - aX;
        let yDiff = bY - aY;
        //let len = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

        if (xDiff !== 0 && yDiff !== 0) {
          // let normalX = xDiff / len;
          // let normalY = yDiff / len;


          let angle = Math.atan(yDiff/xDiff);



          // nodes of same color attract.  nodes of different color repel.
          let forceDirection = aColor === bColor ? -1 : 1;

          // d = 1/2 at^2
          // a = F = k q1 * q2 / r^2

          // let forceX = K * forceDirection * aWeight * bWeight / (xMagnitude * xMagnitude);
          // let forceY = K * forceDirection * aWeight * bWeight / (yMagnitude * yMagnitude);

          let xChange = DIST_CHANGE * Math.cos(angle);
          let yChange = DIST_CHANGE * Math.sin(angle);

          // have different signs
          if (xChange * xDiff < 0) {
            xChange *= -1;
          }
          if (yChange * yDiff < 0) {
            yChange *= -1;
          }

          xChange *= forceDirection;
          yChange *= forceDirection;

          

          xChanges[a] += xChange;
          yChanges[a] += yChange;


        }
        
        
      
      }

      
      
    }

    // console.log(xChanges);
    // console.log(yChanges);

    // now update
    for (let n=0; n<numNodes; n++) {
      model.nodes.xs[n] += xChanges[n];
      model.nodes.ys[n] += yChanges[n];
    }
  }





  console.log(model);

  return model;
};

module.exports = ForceDirectedGraph;
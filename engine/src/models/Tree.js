let bfs = function(root, level, callback) {
  let children = [[root]];
  let numNodes = 0;
  let nodeIndex = 0;
  let parentIndex = -1;

  while(children.length) {

    let grandChildren = [];

    children.forEach(function(childSet) {

      childSet.forEach(function(child) {
        callback(child, level, nodeIndex++, parentIndex);
        numNodes++;
        if (child.children) {
          grandChildren.push(child.children);
        }
      });
      parentIndex++;
    });

    children = grandChildren;
    level++;
  }

  return numNodes;
};

const Tree = function(rootNode) {
  let levels = [];

  let numNodes = bfs(rootNode, 0, function(node, level, nodeIndex, parentIndex) {
    if (!levels[level]) {
      levels[level] = [];
    }
    levels[level].push({
      index: nodeIndex,
      parentIndex: parentIndex
    });
  });

  let model = {
    nodes: {
      xs:     new Float32Array(numNodes),
      ys:     new Float32Array(numNodes),
      colors: new Float32Array(numNodes),
      sizes:  new Float32Array(numNodes)
    },
    edges: new Float32Array((numNodes-1)*2) // num edges = num nodes - 1
  };

  let edgeIndex = 0;
  let numLevels = levels.length;
  levels.forEach(function(level, l) {
    let numLevelNodes = level.length;
    let numSpaces = numLevelNodes + 1;
    let spacing = 2 / numSpaces;
    level.forEach(function(node, n) {
      let nodeIndex = node.index;
      let parentIndex = node.parentIndex;

      model.nodes.xs[nodeIndex] = -1 + n*spacing + spacing;
      model.nodes.ys[nodeIndex] = 1 - (2*l)/(numLevels-1);
      model.nodes.colors[nodeIndex] = l%3;
      model.nodes.sizes[nodeIndex] = 1;

      if (l>0) {
        model.edges[edgeIndex++] = parentIndex;
        model.edges[edgeIndex++] = nodeIndex; 
      }
      

    });
  });

  console.log(levels);

  return model;

  // return {
  //   nodes: {
  //     xs:     new Float32Array([0,  -100, 100, -150,  -50,  50,   150]),
  //     ys:     new Float32Array([150, 0,   0,   -150, -150, -150, -150]),
  //     colors: new Float32Array([0,   1,   1,    2,    2,    2,    2]),
  //     sizes:  new Float32Array([60,  30,  30,   15,   15,   15,   15])
  //   },
  //   edges: new Float32Array([
  //     0, 1, 
  //     0, 2, 
  //     1, 3,
  //     1, 4,
  //     2, 5,
  //     2, 6
  //   ])
  // };
};

module.exports = Tree;
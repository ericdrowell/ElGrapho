// let bfs = function(root, level, callback) {
//   let children = [[root]];
//   let nodeIndex = 0;
//   let parentIndex = -1;

//   while(children.length) {

//     let grandChildren = [];

//     children.forEach(function(childSet) {

//       childSet.forEach(function(child) {
//         callback(child, level, nodeIndex++, parentIndex);
//         if (child.children) {
//           grandChildren.push(child.children);
//         }
//       });
//       parentIndex++;
//     });

//     children = grandChildren;
//     level++;
//   }
// };

let incrementAncestorTotals = function(node, val) {
  node.totalDescendants+=val;

  if (node.parent) {
    incrementAncestorTotals(node.parent, val);
  }
};

let buildMetaTree = function(srcNode, targetNode, left, right, level, nodeSize, callback) {
  targetNode.children = [];
  //targetNode.totalDescendants = 0;

  targetNode.left = left;
  targetNode.right = right;
  targetNode.x = (left + right) / 2;
  targetNode.level = level;
  targetNode.size = nodeSize;

  callback(targetNode);

  if (srcNode.children) {
    let range = right - left;
    let childRange = range / srcNode.children.length;
    let childLeft = left;
    let childNodeSize = nodeSize * 0.7;

    for (let n=0; n<srcNode.children.length; n++) {
      let childRight = childLeft + childRange;

      targetNode.children.push({
        parent: targetNode
      });
      buildMetaTree(srcNode.children[n], targetNode.children[n], childLeft, childRight, level+1, childNodeSize, callback);

      childLeft += childRange;
    }

    incrementAncestorTotals(targetNode, srcNode.children.length);
  }

};

const Tree = function(config) {
  let rootNode = config.rootNode;
  let rootNodeSize = config.rootNodeSize;
  let newRootNode = {};

  let nodes = [];
  let n=0;
  let maxLevel = 0;

  // O(n)
  buildMetaTree(rootNode, newRootNode, -1, 1, 1, rootNodeSize, function(node) {
    node.index = n;
    nodes[n] = node;
    n++;

    if (node.level > maxLevel) {
      maxLevel = node.level;
    }
  });

  let numNodes = nodes.length;

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

  // O(n)
  nodes.forEach(function(node, n) {
    model.nodes.xs[n] = node.x;
    model.nodes.ys[n] = 1 - (2 * ((node.level - 1) / (maxLevel - 1)));
    model.nodes.colors[n] = 0;
    model.nodes.sizes[n] = node.size;

    if (node.parent) {
      model.edges[edgeIndex++] = node.parent.index;
      model.edges[edgeIndex++] = node.index;
    }
  });

  console.log(nodes);

  // let edgeIndex = 0;
  // let numLevels = levels.length;
  // levels.forEach(function(level, l) {
  //   let numLevelNodes = level.length;
  //   let numSpaces = numLevelNodes + 1;
  //   let spacing = 2 / numSpaces;
  //   level.forEach(function(node, n) {
  //     let nodeIndex = node.index;
  //     let parentIndex = node.parentIndex;

  //     model.nodes.xs[nodeIndex] = -1 + n*spacing + spacing;
  //     model.nodes.ys[nodeIndex] = 1 - (2*l)/(numLevels-1);
  //     model.nodes.colors[nodeIndex] = l%3;
  //     model.nodes.sizes[nodeIndex] = nodeSize;

  //     if (l>0) {
  //       model.edges[edgeIndex++] = parentIndex;
  //       model.edges[edgeIndex++] = nodeIndex; 
  //     }
      

  //   });
  // });

  //console.log(levels);



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
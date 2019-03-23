const fitToViewport = require('./utils/fitToViewport');

let incrementAncestorTotals = function(node, val) {
  node.totalDescendants+=val;

  if (node.parent) {
    incrementAncestorTotals(node.parent, val);
  }
};

// DFS
let buildMetaTree = function(srcNode, targetNode, left, right, level, callback) {
  targetNode.children = [];
  //targetNode.totalDescendants = 0;

  targetNode.left = left;
  targetNode.right = right;
  targetNode.x = (left + right) / 2;
  targetNode.level = level;
  targetNode.color = srcNode.color || 0;
  targetNode.index = srcNode.index;

  callback(targetNode);

  if (srcNode.children) {
    let range = right - left;
    let childRange = range / srcNode.children.length;
    let childLeft = left;

    for (let n=0; n<srcNode.children.length; n++) {
      let childRight = childLeft + childRange;

      targetNode.children.push({
        parent: targetNode
      });
      buildMetaTree(srcNode.children[n], targetNode.children[n], childLeft, childRight, level+1, callback);

      childLeft += childRange;
    }

    incrementAncestorTotals(targetNode, srcNode.children.length);
  }

};

// BFS
let getNestedTree = function(config) {
  let edges = config.edges;
  let colors = config.nodes.color;
  let nodes = {};

  // build nodes
  for (let n=0; n<colors.length; n++) {
    nodes[n] = {
      index: n,
      color: colors[n],
      children: [],
      hasParent: false
    };
  }

  for (let n=0; n<edges.from.length; n++) {
    let fromIndex = edges.from[n];
    let toIndex = edges.to[n];

    // parent child relationship
    nodes[fromIndex].children.push(nodes[toIndex]);
    nodes[toIndex].parent = nodes[fromIndex];
    nodes[toIndex].hasParent = true;
  }

  // to find the root node, iterate through nodes and find the node that does not have a parent
  for (var key in nodes) {
    let node = nodes[key];
    if (!node.hasParent) {
      return node;
    }
  }

  return null;
};


const Tree = function(config) {
  let rootNode = getNestedTree(config);

  let newRootNode = {};

  let nodes = [];
  let n=0;
  let maxLevel = 0;

  // O(n)
  buildMetaTree(rootNode, newRootNode, -1, 1, 1, function(node) {
    nodes[n] = node;
    n++;

    if (node.level > maxLevel) {
      maxLevel = node.level;
    }
  });

  nodes.sort(function(a, b) {
    return a.index - b.index;
  });

  //let numNodes = nodes.length;

  let model = {
    nodes: {
      x:     [],
      y:     [],
      color: []
    },
    edges: {
      from: [],
      to: []
    },
    width: config.width,
    height: config.height
  };

  // O(n)
  nodes.forEach(function(node, n) {
    model.nodes.x[n] = node.x;
    model.nodes.y[n] = 1 - (2 * ((node.level - 1) / (maxLevel - 1)));
    model.nodes.color[n] = node.color;

    if (node.parent) {
      model.edges.from[n] = node.parent.index;
      model.edges.to[n] = node.index;
    }
  });

  fitToViewport(model.nodes);

  return model;
};

module.exports = Tree;
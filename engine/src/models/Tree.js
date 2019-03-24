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
  targetNode.group = srcNode.group || 0;
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
let getNestedTree = function(model) {
  let nodes = model.nodes;
  let edges = model.edges;
  let nestedNodes = {};

  // build nodes
  nodes.forEach(function(node, n) {
    nestedNodes[n] = {
      index: n,
      group: node.group,
      children: [],
      hasParent: false
    };
  });

  edges.forEach(function(edge) {
    let fromIndex = edge.from;
    let toIndex = edge.to;

    // parent child relationship
    nestedNodes[fromIndex].children.push(nestedNodes[toIndex]);
    nestedNodes[toIndex].parent = nestedNodes[fromIndex];
    nestedNodes[toIndex].hasParent = true;
  });

  // to find the root node, iterate through nodes and find the node that does not have a parent
  for (var key in nestedNodes) {
    let node = nestedNodes[key];
    if (!node.hasParent) {
      return node;
    }
  }

  return null;
};


const Tree = function(model) {
  let rootNode = getNestedTree(model);
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

  // O(n)
  nodes.forEach(function(node, n) {
    model.nodes[n].x = node.x;
    model.nodes[n].y = 1 - (2 * ((node.level - 1) / (maxLevel - 1)));

  });

  fitToViewport(model.nodes);

  return model;
};

module.exports = Tree;
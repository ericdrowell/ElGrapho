let incrementAncestorTotals = function(node, val) {
  node.totalDescendants+=val;

  if (node.parent) {
    incrementAncestorTotals(node.parent, val);
  }
};

let buildMetaTree = function(srcNode, targetNode, left, right, level, callback) {
  targetNode.children = [];
  //targetNode.totalDescendants = 0;

  targetNode.left = left;
  targetNode.right = right;
  targetNode.x = (left + right) / 2;
  targetNode.level = level;
  targetNode.color = srcNode.color || 0;

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

const Tree = function(config) {
  let rootNode = config.rootNode;
  let newRootNode = {};

  let nodes = [];
  let n=0;
  let maxLevel = 0;

  // O(n)
  buildMetaTree(rootNode, newRootNode, -1, 1, 1, function(node) {
    node.index = n;
    nodes[n] = node;
    n++;

    if (node.level > maxLevel) {
      maxLevel = node.level;
    }
  });

  //let numNodes = nodes.length;

  let model = {
    nodes: {
      xs:     [],
      ys:     [],
      colors: []
    },
    edges: [] // num edges = num nodes - 1
  };

  let edgeIndex = 0;

  // O(n)
  nodes.forEach(function(node, n) {
    model.nodes.xs[n] = node.x;
    model.nodes.ys[n] = 1 - (2 * ((node.level - 1) / (maxLevel - 1)));
    model.nodes.colors[n] = node.color;

    if (node.parent) {
      model.edges[edgeIndex++] = node.parent.index;
      model.edges[edgeIndex++] = node.index;
    }
  });

  return model;
};

module.exports = Tree;
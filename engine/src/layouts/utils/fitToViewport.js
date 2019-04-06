module.exports = function(nodes, maintainAspectRatio) {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  nodes.forEach(function(node) {
    let nodeX = node.x;
    let nodeY = node.y;

    minX = Math.min(minX, nodeX);
    minY = Math.min(minY, nodeY);
    maxX = Math.max(maxX, nodeX);
    maxY = Math.max(maxY, nodeY);
  });

  // normalized width is 2 and height is 2.  Thus, to give a little padding,
  // using 1.9
  let diffX = maxX - minX;
  let diffY = maxY - minY;
  let xOffset = minX + diffX / 2;
  let yOffset = minY + diffY / 2;
  let xFactor = 1.9 / diffX;
  let yFactor = 1.9 / diffY;

  // we want to adjust the x and y equally to preserve ratio

  if (maintainAspectRatio) {
    let factor = Math.min(xFactor, yFactor);
    xFactor = factor;
    yFactor = factor;
  }

  nodes.forEach(function(node) {
    node.x = (node.x - xOffset) * xFactor;
    node.y = (node.y - yOffset) * yFactor;
  });
};
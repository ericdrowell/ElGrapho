module.exports = function(nodes) {
  let numNodes = nodes.color.length;

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (let n=0; n<numNodes; n++) {
    let nodeX = nodes.x[n];
    let nodeY = nodes.y[n];

    minX = Math.min(minX, nodeX);
    minY = Math.min(minY, nodeY);
    maxX = Math.max(maxX, nodeX);
    maxY = Math.max(maxY, nodeY);
  }

  //console.log(minX, minY, maxX, maxY);

  // normalized width is 2 and height is 2.  Thus, to give a little padding,
  // using 1.9

  let diffX = maxX - minX;
  let diffY = maxY - minY;
  let xOffset = minX + diffX / 2;
  let yOffset = minY + diffY / 2;
  let xFactor = 1.9 / diffX;
  let yFactor = 1.9 / diffY;

  // we want to adjust the x and y equally to preserve ratio
  let factor = Math.min(xFactor, yFactor);

  //console.log(xFactor, yFactor);

  for (let n=0; n<numNodes; n++) {
    nodes.x[n] = (nodes.x[n] - xOffset) * factor;
    nodes.y[n] = (nodes.y[n] - yOffset) * factor;
  }
};
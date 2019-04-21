//const fitToViewport = require('./utils/fitToViewport');

const Cluster = function(model) {
  // let width = model.width;
  // let height = model.height;

  let xFactor, yFactor;

  // if (width > height) {
  //   xFactor = height/width;
  yFactor = 1;
  // }
  // else {
  xFactor = 1;
  //   yFactor = width/height;
  // }

  // keys are color integers, values are arrays.  The arrays contain node indices
  let groups = {};

  model.nodes.forEach(function(node, n) {
    let group = node.group;
    if (groups[group] === undefined) {
      groups[group] = [];
    }
    groups[group].push(n);
  });

  let keys = Object.keys(groups);
  let numGroups = keys.length;
  let key;
  let groupIndex = 0;

  let maxGroupCount = 0;
  for (key in groups) {
    maxGroupCount = Math.max(maxGroupCount, groups[key].length);
  }

  let arcLength = 1 / Math.sqrt(maxGroupCount);

  for (key in groups) {
    let indices = groups[key];
    let centerAngle = -2*Math.PI*groupIndex/numGroups + Math.PI;

    let clusterCenterX, clusterCenterY;

    if (numGroups === 1) {
      clusterCenterX = 0;
      clusterCenterY = 0;
    }
    else {
      clusterCenterX = Math.cos(centerAngle);
      clusterCenterY = Math.sin(centerAngle);
    }

    let radius = arcLength;
    let angleStep = arcLength / radius; // arc length = radius * angle -> angle = arc length / radius
    let angle = 0;

    indices.forEach(function(index) {
      let x = Math.cos(angle) * radius * xFactor;
      let y = Math.sin(angle) * radius * yFactor;

      model.nodes[index].x = clusterCenterX + x;
      model.nodes[index].y = clusterCenterY + y;
      radius += arcLength * angleStep / (2 * Math.PI);
      angleStep = arcLength / radius;
      angle -= angleStep;
    });
    
    groupIndex++;
  }

  //fitToViewport(model.nodes, true);

  return model;
};

module.exports = Cluster;
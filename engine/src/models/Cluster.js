let Cluster = function(config) {
  let model = {
    nodes: {
      xs: [],
      ys: [],
      colors: config.nodes.colors.slice()
    },
    edges: config.edges.slice()
  };

  // keys are color integers, values are arrays.  The arrays contain node indices
  let groups = {};

  config.nodes.colors.forEach(function(color, n) {
    if (groups[color] === undefined) {
      groups[color] = [];
    }

    groups[color].push(n);
  });

  //console.log(groups);

  let keys = Object.keys(groups);
  let numGroups = keys.length;
  //let clusterRadius = 0.2;

  let key;
  let groupIndex = 0;

  let maxGroupCount = 0;
  for (key in groups) {
    maxGroupCount = Math.max(maxGroupCount, groups[key].length);
  }

  let arcLength = 1 / Math.sqrt(maxGroupCount);

  for (key in groups) {
    let indices = groups[key];
    let centerAngle = -2*Math.PI*groupIndex/numGroups;

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
      let x = Math.cos(angle) * radius;
      let y = Math.sin(angle) * radius;

      model.nodes.xs[index] = clusterCenterX + x;
      model.nodes.ys[index] = clusterCenterY + y;

      radius += arcLength * angleStep / (2 * Math.PI);
      angleStep = arcLength / radius;
      angle -= angleStep;
    });
    
    groupIndex++;
  }

  return model;
};

module.exports = Cluster;
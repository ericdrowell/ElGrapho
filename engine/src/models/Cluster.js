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
    
    let ARC_LENGTH = 0.1;

    let radius = ARC_LENGTH;
    let angleStep = ARC_LENGTH / radius; // arc length = radius * angle -> angle = arc length / radius
    let angle = 0;

    indices.forEach(function(index) {
      let x = Math.cos(angle) * radius;
      let y = Math.sin(angle) * radius;

      model.nodes.xs[index] = clusterCenterX + x;
      model.nodes.ys[index] = clusterCenterY + y;

      radius += ARC_LENGTH * angleStep / (2 * Math.PI);
      angleStep = ARC_LENGTH / radius;
      angle -= angleStep;
    });
    
    groupIndex++;
  }

  return model;
};

module.exports = Cluster;
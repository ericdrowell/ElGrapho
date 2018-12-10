const Profiler = require('./Profiler');
const Theme = require('./Theme');
//const Color = require('./Color');
const Util = require('./Util');
const glMatrix = require('gl-matrix');
const vec2 = glMatrix.vec2;

const VertexBridges = {
  getRandomPointPositions: Profiler('VertexBridges.getRandomPointPositions', function(num, width, height) {
    let points = new Float32Array(num*2);
    for (let n=0; n<num*2; n+=2) {
      let x = Math.random()*width - width/2;
      let y = Math.random()*height - height/2;
      points[n] = x;
      points[n+1] = y;
    }
    return points;
  }),

  getRandomColors: Profiler('VertexBridges.getRandomColors', function(num) {
    let colors = new Float32Array(num*4);
    for (let n=0; n<num*4; n+=4) {

      let colorIndex = Math.floor(Math.random() * Theme.palette.length/3); // between 0 and palette length
      colors[n] = colorIndex;
    }
    return colors;
  }),

  // getHitColors: Profiler('VertexBridges.getHitColors', function(num) {
  //   let hitColors = new Float32Array(num*4);
  //   let counter = 0;
  //   for (let n=0; n<num*4; n+=4) {
  //     let rgb = Color.intToRGB(counter++);
  //     let r = rgb[0];
  //     let g = rgb[1];
  //     let b = rgb[2];

  //     hitColors[n] = r/255;
  //     hitColors[n+1] = g/255;
  //     hitColors[n+2] = b/255;
  //     hitColors[n+3] = 1;
  //   }
  //   return hitColors;
  // }),
  getRandomSizes: Profiler('VertexBridges.getRandomSizes', function(num, minPointSize, maxPointSize) {
    let sizes = new Float32Array(num);
    for (let n=0; n<num; n++) {
      let size = (Math.random() * Math.random() * Math.random() * (maxPointSize-minPointSize)) + minPointSize;
      sizes[n] = size;
    }
    return sizes;
  }),

  getConstantSizes: Profiler('VertexBridges.getConstantSizes', function(num, size) {
    let sizes = new Float32Array(num);
    for (let n=0; n<num; n++) {
      sizes[n] = size;
    }
    return sizes;
  }),

  nodesAndEdgesToVertices: Profiler('VertexBridges.nodesAndEdgesToVertices', function(nodes, edges) {
    let positions = new Float32Array(nodes.xs.length*2);

    let positionCounter = 0;
    for (let n=0; n<nodes.xs.length; n++) {
      positions[positionCounter++] = nodes.xs[n];
      positions[positionCounter++] = nodes.ys[n];
    }

    let colors = new Float32Array(nodes.colors);
    let sizes = new Float32Array(nodes.sizes);

    // one edge is defined by two elements (from and to).  each edge requires 2 triangles.  Each triangle has 3 positions, with an x and y for each
    let numEdges = edges.length / 2;
    let trianglePositions = new Float32Array(numEdges * 12);
    let triangleColors = new Float32Array(numEdges * 6);

    let trianglePositionsIndex = 0;
    let triangleColorsIndex = 0;

    let edgeSize = Math.min.apply(Math, nodes.sizes)/2 * 0.3;
    let normalDistance = edgeSize/2;

    for (let n=0; n<edges.length; n+=2) {
      let pointIndex0 = edges[n];
      let pointIndex1 = edges[n+1];
      

      let x0 = nodes.xs[pointIndex0];
      let x1 = nodes.xs[pointIndex1];
      let y0 = nodes.ys[pointIndex0];
      let y1 = nodes.ys[pointIndex1];
      let vectorX = x1 - x0;
      let vectorY = y1 - y0;
      let vector = vec2.fromValues(vectorX, vectorY);
      let normalizedVector = vec2.normalize(vec2.create(), vector);
      let perpVector = vec2.rotate(vec2.create(), normalizedVector, vec2.create(), Math.PI/2);
      let offsetVector = vec2.scale(vec2.create(), perpVector, normalDistance);
      let xOffset = -1 * offsetVector[0];
      let yOffset = offsetVector[1];

      // first triangle
      trianglePositions[trianglePositionsIndex++] = x0 - xOffset;
      trianglePositions[trianglePositionsIndex++] = y0 + yOffset;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex0];

      trianglePositions[trianglePositionsIndex++] = x1 - xOffset;
      trianglePositions[trianglePositionsIndex++] = y1 + yOffset;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];

      trianglePositions[trianglePositionsIndex++] = x0 + xOffset;
      trianglePositions[trianglePositionsIndex++] = y0 - yOffset;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex0];


      // second triangle
      trianglePositions[trianglePositionsIndex++] = x1 + xOffset;
      trianglePositions[trianglePositionsIndex++] = y1 - yOffset;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];

      trianglePositions[trianglePositionsIndex++] = x0 + xOffset;
      trianglePositions[trianglePositionsIndex++] = y0 - yOffset;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex0];

      trianglePositions[trianglePositionsIndex++] = x1 - xOffset;
      trianglePositions[trianglePositionsIndex++] = y1 + yOffset;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];
    }

    return {
      points: {
        positions: positions,
        colors: colors,
        sizes: sizes
      },
      triangles: {
        positions: trianglePositions,
        colors: triangleColors
      }
    };
  }),

  // getFocused: Profiler('VertexBridges.getFocused', function(num) {
  //   let focused = new Float32Array(num);
  //   for (let n=0; n<num; n++) {
  //     focused[n] = 0;
  //   }
  //   return focused;
  // }),

  /**
   * generate line connections between random nodes
   * @param {Float32Array} points
   * @param {Number} maxConnectionsPerNode
   */
  getGraphTriangles: Profiler('VertexBridges.getGraphTriangles', function(config) {
    let points = config.points;
    let maxConnectionsPerNode = config.maxConnectionsPerNode;
    let edgeSize = config.edgeSize;
    let numNodes = points.positions.length/2;
    let numLines = numNodes * maxConnectionsPerNode;

    let trianglePositions = new Float32Array(numLines*6);
    let trianglePositionIndex = 0;
    let triangleColorIndex = 0;

    const NORMAL_DISTANCE = edgeSize/2;

    let triangleColors = new Float32Array(numLines*3);

    function addColor(n) {
      triangleColors[triangleColorIndex++] = points.colors[n];
    }

    for (let n=0; n<numNodes-1; n++) {
      let connectedNodes = {};

      for (let i=0; i<maxConnectionsPerNode; i++) {
        let randomNodeIndex = Util.getRandomInt(n+1, numNodes-1);
        //let randomNodeIndex = n+i;

        // make sure we don't dupe lines
        if (!connectedNodes[randomNodeIndex]) {
          // TODO: offsets need to be calculated from normals
          // normal.x - -dy
          // normal.y = dx
          let x1 = points.positions[randomNodeIndex*2];
          let x0 = points.positions[n*2];
          let y1 = points.positions[randomNodeIndex*2 + 1];
          let y0 = points.positions[n*2 + 1];
          let vectorX = x1 - x0;
          let vectorY = y1 - y0;
          let vector = vec2.fromValues(vectorX, vectorY);
          let normalizedVector = vec2.normalize(vec2.create(), vector);
          let perpVector = vec2.rotate(vec2.create(), normalizedVector, vec2.create(), Math.PI/2);
          let offsetVector = vec2.scale(vec2.create(), perpVector, NORMAL_DISTANCE);


          // let length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
          // let normalX = vectorX / length;
          // let normalY = vectorY / length;
          // let xOffset = -1 * normalX * NORMAL_DISTANCE;
          // let yOffset = -1 * normalY * NORMAL_DISTANCE;

          let xOffset = -1 * offsetVector[0];
          let yOffset = offsetVector[1];

          //console.log(n, randomNodeIndex, perpVector);

          // triangle 1
          trianglePositions[trianglePositionIndex++] = x0 - xOffset;
          trianglePositions[trianglePositionIndex++] = y0 + yOffset;
          addColor(n);

          trianglePositions[trianglePositionIndex++] = x1 - xOffset;
          trianglePositions[trianglePositionIndex++] = y1 + yOffset;
          addColor(randomNodeIndex);

          trianglePositions[trianglePositionIndex++] = x0 + xOffset;
          trianglePositions[trianglePositionIndex++] = y0 - yOffset;
          addColor(n);

          // triangle 2
          trianglePositions[trianglePositionIndex++] = x1 + xOffset;
          trianglePositions[trianglePositionIndex++] = y1 - yOffset;
          addColor(randomNodeIndex);

          trianglePositions[trianglePositionIndex++] = x0 + xOffset;
          trianglePositions[trianglePositionIndex++] = y0 - yOffset;
          addColor(n);

          trianglePositions[trianglePositionIndex++] = x1 - xOffset;
          trianglePositions[trianglePositionIndex++] = y1 + yOffset;
          addColor(randomNodeIndex);



          connectedNodes[randomNodeIndex] = 1;
        }
      }
    }

    return {
      positions: trianglePositions,
      colors: triangleColors
    };
  }),

  getRandomPoints: Profiler('VertexBridges.getRandomPoints', function(config) {
    let numPoints = config.numPoints;
    let width = config.width;
    let height = config.height;
    let pointSize = config.pointSize;
    return {
      positions: VertexBridges.getRandomPointPositions(numPoints, width, height),
      colors: VertexBridges.getRandomColors(numPoints),
      sizes: VertexBridges.getConstantSizes(numPoints, pointSize),
    };
  }),

  getRandomGraphPoints: Profiler('VertexBridges.getRandomGraphPoints', function(numPoints, width, height, edgeSize) {
    return {
      positions: VertexBridges.getRandomPointPositions(numPoints, width, height),
      colors: VertexBridges.getRandomColors(numPoints),
      sizes: VertexBridges.getConstantSizes(numPoints, edgeSize)
    };
  }),

  getRandomClusteredGraphPoints: Profiler('VertexBridges.getRandomClusteredGraphPoints', function(config) {
    let numPoints = config.numPoints;
    let width = config.width;
    let height = config.height;
    let minPointSize = config.minPointSize;
    let maxPointSize = config.maxPointSize;

    let minWidthHeight = Math.min(width, height);

    let clusters = [
      {
        x: 0,
        y: height/4,
        radius: minWidthHeight/4
      },
      {
        x: width/4,
        y: -height/4,
        radius: minWidthHeight/4
      },
      {
        x: -width/4,
        y: -height/4,
        radius: minWidthHeight/4
      }
    ];

    let positions = new Float32Array(numPoints*2);
    let colors = new Float32Array(numPoints);
    let positionIndex = 0;
    let colorIndex = 0;

    for (let n=0; n<numPoints; n++) {
      let clusterIndex = Math.floor(Math.random() * clusters.length);
      let cluster = clusters[clusterIndex];

      let radius = Math.random()*cluster.radius;
      let angle = Math.random() * Math.PI*2;


      let x = cluster.x + Math.cos(angle) * radius;
      let y = cluster.y + Math.sin(angle) * radius;

      positions[positionIndex++] = x;
      positions[positionIndex++] = y;

      colors[colorIndex++] = clusterIndex;
    }

    return {
      positions: positions,
      colors: colors,
      sizes: VertexBridges.getRandomSizes(numPoints, minPointSize, maxPointSize)
    };
  })




};

module.exports = VertexBridges;




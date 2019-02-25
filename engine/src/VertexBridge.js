const Profiler = require('./Profiler');
const glMatrix = require('gl-matrix');
const vec2 = glMatrix.vec2;
const MAX_NODE_SIZE = 16;

const VertexBridge = {
  modelToVertices: Profiler('VertexBridges.modelToVertices', function(model, width, height) {
    let nodes = model.nodes;
    let edges = model.edges;
    let positions = new Float32Array(nodes.xs.length*2);
    let halfWidth = width/2;
    let halfHeight = height/2;

    // convert normalized xs and ys to pixel values
    nodes.xs = nodes.xs.map(function(el) {
      return el * halfWidth;
    });
    nodes.ys = nodes.ys.map(function(el) {
      return el * halfHeight;
    });

    let positionCounter = 0;
    for (let n=0; n<nodes.xs.length; n++) {
      positions[positionCounter++] = nodes.xs[n];
      positions[positionCounter++] = nodes.ys[n];
    }

    let colors = new Float32Array(nodes.colors);

    // one edge is defined by two elements (from and to).  each edge requires 2 triangles.  Each triangle has 3 positions, with an x and y for each
    let numEdges = edges.length / 2;
    let trianglePositions = new Float32Array(numEdges * 12);
    let triangleNormals = new Float32Array(numEdges * 12);
    let triangleColors = new Float32Array(numEdges * 6);

    let trianglePositionsIndex = 0;
    let triangleNormalsIndex = 0;
    let triangleColorsIndex = 0;

    for (let n=0; n<edges.length; n+=2) {
      let pointIndex0 = edges[n];
      let pointIndex1 = edges[n+1];
      let normalDistance0 = MAX_NODE_SIZE*0.1;
      let normalDistance1 = MAX_NODE_SIZE*0.1;

      let x0 = nodes.xs[pointIndex0];
      let x1 = nodes.xs[pointIndex1];
      let y0 = nodes.ys[pointIndex0];
      let y1 = nodes.ys[pointIndex1];
      let vectorX = x1 - x0;
      let vectorY = y1 - y0;
      let vector = vec2.fromValues(vectorX, vectorY);
      let normalizedVector = vec2.normalize(vec2.create(), vector);
      let perpVector = vec2.rotate(vec2.create(), normalizedVector, vec2.create(), Math.PI/2);
      let offsetVector0 = vec2.scale(vec2.create(), perpVector, normalDistance0);
      let offsetVector1 = vec2.scale(vec2.create(), perpVector, normalDistance1);
      let xOffset0 = -1 * offsetVector0[0];
      let yOffset0 = offsetVector0[1];
      let xOffset1 = -1 * offsetVector1[0];
      let yOffset1 = offsetVector1[1];

      //if (magicZoom) {
      // first triangle
      trianglePositions[trianglePositionsIndex++] = x0;
      trianglePositions[trianglePositionsIndex++] = y0;
      triangleNormals[triangleNormalsIndex++] = xOffset0 * -1;
      triangleNormals[triangleNormalsIndex++] = yOffset0;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex0];

      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = xOffset1 * -1;
      triangleNormals[triangleNormalsIndex++] = yOffset1;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];

      trianglePositions[trianglePositionsIndex++] = x0;
      trianglePositions[trianglePositionsIndex++] = y0;
      triangleNormals[triangleNormalsIndex++] = xOffset0;
      triangleNormals[triangleNormalsIndex++] = yOffset0 * -1;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex0];


      // second triangle
      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = xOffset1;
      triangleNormals[triangleNormalsIndex++] = yOffset1 * -1;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];

      trianglePositions[trianglePositionsIndex++] = x0;
      trianglePositions[trianglePositionsIndex++] = y0;
      triangleNormals[triangleNormalsIndex++] = xOffset0;
      triangleNormals[triangleNormalsIndex++] = yOffset0 * -1;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex0];

      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = xOffset1 * -1;
      triangleNormals[triangleNormalsIndex++] = yOffset1;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];
      // }
      // else {
      //   // first triangle
      //   trianglePositions[trianglePositionsIndex++] = x0 + xOffset0 * -1;
      //   trianglePositions[trianglePositionsIndex++] = y0 + yOffset0;
      //   triangleNormals[triangleNormalsIndex++] = 0;
      //   triangleNormals[triangleNormalsIndex++] = 0;
      //   triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex0];

      //   trianglePositions[trianglePositionsIndex++] = x1 + xOffset1 * -1;
      //   trianglePositions[trianglePositionsIndex++] = y1 + yOffset1;
      //   triangleNormals[triangleNormalsIndex++] = 0;
      //   triangleNormals[triangleNormalsIndex++] = 0;
      //   triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];

      //   trianglePositions[trianglePositionsIndex++] = x0 + xOffset0;
      //   trianglePositions[trianglePositionsIndex++] = y0 + yOffset0 * -1;
      //   triangleNormals[triangleNormalsIndex++] = 0;
      //   triangleNormals[triangleNormalsIndex++] = 0;
      //   triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex0];


      //   // second triangle
      //   trianglePositions[trianglePositionsIndex++] = x1 + xOffset1;
      //   trianglePositions[trianglePositionsIndex++] = y1 + yOffset1 * -1;
      //   triangleNormals[triangleNormalsIndex++] = 0;
      //   triangleNormals[triangleNormalsIndex++] = 0;
      //   triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];

      //   trianglePositions[trianglePositionsIndex++] = x0 + xOffset0;
      //   trianglePositions[trianglePositionsIndex++] = y0 + yOffset0 * -1;
      //   triangleNormals[triangleNormalsIndex++] = 0;
      //   triangleNormals[triangleNormalsIndex++] = 0;
      //   triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex0];

      //   trianglePositions[trianglePositionsIndex++] = x1 + xOffset1 * -1;
      //   trianglePositions[trianglePositionsIndex++] = y1 + yOffset1;
      //   triangleNormals[triangleNormalsIndex++] = 0;
      //   triangleNormals[triangleNormalsIndex++] = 0;
      //   triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];
      // }
    }

    return {
      points: {
        positions: positions,
        colors: colors
      },
      triangles: {
        positions: trianglePositions,
        normals: triangleNormals,
        colors: triangleColors
      }
    };
  })
};

module.exports = VertexBridge;




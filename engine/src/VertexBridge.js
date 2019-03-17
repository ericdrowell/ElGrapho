const Profiler = require('./Profiler');
const glMatrix = require('gl-matrix');
const vec2 = glMatrix.vec2;
const MAX_NODE_SIZE = 16;
const ARROW_WIDTH_MULTIPLIER = 4; // edge width times this number equals arrow width

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
    let numArrows = numEdges;

    let trianglePositions = new Float32Array(numEdges * 12 + numArrows * 6);
    let triangleNormals = new Float32Array(numEdges * 12 + numArrows * 6);
    let triangleColors = new Float32Array(numEdges * 6 + numArrows * 6);

    let trianglePositionsIndex = 0;
    let triangleNormalsIndex = 0;
    let triangleColorsIndex = 0;

    for (let n=0; n<edges.length; n+=2) {
      let pointIndex0 = edges[n];
      let pointIndex1 = edges[n+1];
      let normalDistance = MAX_NODE_SIZE*0.1;

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

      let arrowVector = vec2.scale(vec2.create(), normalizedVector, 16);
      let arrowOffsetX = arrowVector[0];
      let arrowOffsetY = arrowVector[1];
 
      // first triangle of line
      trianglePositions[trianglePositionsIndex++] = x0;
      trianglePositions[trianglePositionsIndex++] = y0;
      triangleNormals[triangleNormalsIndex++] = xOffset * -1;
      triangleNormals[triangleNormalsIndex++] = yOffset;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex0];

      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = xOffset * -1;
      triangleNormals[triangleNormalsIndex++] = yOffset;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];

      trianglePositions[trianglePositionsIndex++] = x0;
      trianglePositions[trianglePositionsIndex++] = y0;
      triangleNormals[triangleNormalsIndex++] = xOffset;
      triangleNormals[triangleNormalsIndex++] = yOffset * -1;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex0];

      // second triangle of line
      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = xOffset;
      triangleNormals[triangleNormalsIndex++] = yOffset * -1;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];

      trianglePositions[trianglePositionsIndex++] = x0;
      trianglePositions[trianglePositionsIndex++] = y0;
      triangleNormals[triangleNormalsIndex++] = xOffset;
      triangleNormals[triangleNormalsIndex++] = yOffset * -1;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex0];

      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = xOffset * -1;
      triangleNormals[triangleNormalsIndex++] = yOffset;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];



      // triangle for arrow
      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = 0;
      triangleNormals[triangleNormalsIndex++] = 0;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];

      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetX + xOffset * ARROW_WIDTH_MULTIPLIER;
      triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetY + yOffset * -1 * ARROW_WIDTH_MULTIPLIER;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];

      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetX + xOffset * -1 * ARROW_WIDTH_MULTIPLIER;
      triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetY + yOffset * ARROW_WIDTH_MULTIPLIER;
      triangleColors[triangleColorsIndex++] = nodes.colors[pointIndex1];


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




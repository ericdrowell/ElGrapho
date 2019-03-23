const Profiler = require('./Profiler');
const glMatrix = require('gl-matrix');
const vec2 = glMatrix.vec2;
const MAX_NODE_SIZE = 16;
const ARROW_WIDTH_MULTIPLIER = 4; // edge width times this number equals arrow width
 
const VertexBridge = {
  modelToVertices: Profiler('VertexBridges.modelToVertices', function(model, width, height, showArrows) {
    let nodes = model.nodes;
    let edges = model.edges;
    let positions = new Float32Array(nodes.x.length*2);
    let halfWidth = width/2;
    let halfHeight = height/2;

    // convert normalized x and y to pixel values
    nodes.x = nodes.x.map(function(el) {
      return el * halfWidth;
    });
    nodes.y = nodes.y.map(function(el) {
      return el * halfHeight;
    });

    let positionCounter = 0;
    for (let n=0; n<nodes.x.length; n++) {
      positions[positionCounter++] = nodes.x[n];
      positions[positionCounter++] = nodes.y[n];
    }

    let colors = new Float32Array(nodes.color);

    // one edge is defined by two elements (from and to).  each edge requires 2 triangles.  Each triangle has 3 positions, with an x and y for each
    let numEdges = edges.from.length;
    let numArrows = showArrows ? numEdges : 0;

    let trianglePositions = new Float32Array(numEdges * 12 + numArrows * 6);
    let triangleNormals = new Float32Array(numEdges * 12 + numArrows * 6);
    let triangleColors = new Float32Array(numEdges * 6 + numArrows * 6);

    let trianglePositionsIndex = 0;
    let triangleNormalsIndex = 0;
    let triangleColorsIndex = 0;

    for (let n=0; n<numEdges; n++) {
      let pointIndex0 = edges.from[n];
      let pointIndex1 = edges.to[n];
      let normalDistance = MAX_NODE_SIZE*0.1;

      let x0 = nodes.x[pointIndex0];
      let x1 = nodes.x[pointIndex1];
      let y0 = nodes.y[pointIndex0];
      let y1 = nodes.y[pointIndex1];
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
      triangleColors[triangleColorsIndex++] = nodes.color[pointIndex0];

      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = xOffset * -1;
      triangleNormals[triangleNormalsIndex++] = yOffset;
      triangleColors[triangleColorsIndex++] = nodes.color[pointIndex1];

      trianglePositions[trianglePositionsIndex++] = x0;
      trianglePositions[trianglePositionsIndex++] = y0;
      triangleNormals[triangleNormalsIndex++] = xOffset;
      triangleNormals[triangleNormalsIndex++] = yOffset * -1;
      triangleColors[triangleColorsIndex++] = nodes.color[pointIndex0];

      // second triangle of line
      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = xOffset;
      triangleNormals[triangleNormalsIndex++] = yOffset * -1;
      triangleColors[triangleColorsIndex++] = nodes.color[pointIndex1];

      trianglePositions[trianglePositionsIndex++] = x0;
      trianglePositions[trianglePositionsIndex++] = y0;
      triangleNormals[triangleNormalsIndex++] = xOffset;
      triangleNormals[triangleNormalsIndex++] = yOffset * -1;
      triangleColors[triangleColorsIndex++] = nodes.color[pointIndex0];

      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = xOffset * -1;
      triangleNormals[triangleNormalsIndex++] = yOffset;
      triangleColors[triangleColorsIndex++] = nodes.color[pointIndex1];


      if (showArrows) {
        // triangle for arrow
        trianglePositions[trianglePositionsIndex++] = x1;
        trianglePositions[trianglePositionsIndex++] = y1;
        triangleNormals[triangleNormalsIndex++] = 0;
        triangleNormals[triangleNormalsIndex++] = 0;
        triangleColors[triangleColorsIndex++] = nodes.color[pointIndex1];

        trianglePositions[trianglePositionsIndex++] = x1;
        trianglePositions[trianglePositionsIndex++] = y1;
        triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetX + xOffset * ARROW_WIDTH_MULTIPLIER;
        triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetY + yOffset * -1 * ARROW_WIDTH_MULTIPLIER;
        triangleColors[triangleColorsIndex++] = nodes.color[pointIndex1];

        trianglePositions[trianglePositionsIndex++] = x1;
        trianglePositions[trianglePositionsIndex++] = y1;
        triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetX + xOffset * -1 * ARROW_WIDTH_MULTIPLIER;
        triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetY + yOffset * ARROW_WIDTH_MULTIPLIER;
        triangleColors[triangleColorsIndex++] = nodes.color[pointIndex1];
      }

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




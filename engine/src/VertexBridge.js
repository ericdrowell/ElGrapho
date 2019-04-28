const Profiler = require('./Profiler');
//const glMatrix = require('gl-matrix');
//const vec2 = glMatrix.vec2;
//const MAX_NODE_SIZE = 16;
//const ARROW_WIDTH_MULTIPLIER = 4; // edge width times this number equals arrow width
 
const VertexBridge = {
  modelToVertices: Profiler('VertexBridges.modelToVertices', function(model/*, showArrows*/) {
    let nodes = model.nodes;
    let edges = model.edges;
    let pointPositions = new Float32Array(nodes.length*2);
    //let halfWidth = width/2;
    //let halfHeight = height/2;
    let pointColors = new Float32Array(nodes.length);

    
    let positionCounter = 0;
    nodes.forEach(function(node, n) {
      // convert normalized x and y to pixel values
      //node.x *= halfWidth;
      //node.y *= halfHeight;

      pointPositions[positionCounter++] = node.x;
      pointPositions[positionCounter++] = node.y;

      pointColors[n] = node.group;
    });


    // one edge is defined by two elements (from and to).  each edge requires 2 triangles.  Each triangle has 3 positions, with an x and y for each
    let numEdges = edges.length;
    //let numArrows = showArrows ? numEdges : 0;

    // let trianglePositions = new Float32Array(numEdges * 12 + numArrows * 6);
    // let triangleNormals = new Float32Array(numEdges * 12 + numArrows * 6);
    // let triangleColors = new Float32Array(numEdges * 6 + numArrows * 6);

    // let trianglePositionsIndex = 0;
    // let triangleNormalsIndex = 0;
    // let triangleColorsIndex = 0;

    let quadStarts = new Float32Array(numEdges * 2);
    let quadControls = new Float32Array(numEdges * 2);
    let quadEnds = new Float32Array(numEdges * 2);
    let quadGroups = new Float32Array(numEdges);

    let startCounter = 0;
    let endCounter = 0;
    let controlCounter = 0;
    let groupCounter = 0;

    for (let n=0; n<numEdges; n++) {
      let pointIndex0 = edges[n].from;
      let pointIndex1 = edges[n].to;

      let x0 = nodes[pointIndex0].x;
      let x1 = nodes[pointIndex1].x;
      let y0 = nodes[pointIndex0].y;
      let y1 = nodes[pointIndex1].y;
      let controlX = 0;
      let controlY = 0;

      quadStarts[startCounter++] = x0;
      quadStarts[startCounter++] = y0;

      quadEnds[endCounter++] = x1;
      quadEnds[endCounter++] = y1;

      quadControls[controlCounter++] = controlX;
      quadControls[controlCounter++] = controlY;

      quadGroups[groupCounter++] = 0;

 


      // let vectorX = x1 - x0;
      // let vectorY = y1 - y0;
      // let vector = vec2.fromValues(vectorX, vectorY);
      // let normalizedVector = vec2.normalize(vec2.create(), vector);
      // let perpVector = vec2.rotate(vec2.create(), normalizedVector, vec2.create(), Math.PI/2);
      // let offsetVector = perpVector; // vec2.scale(vec2.create(), perpVector, normalDistance);
      // let xOffset = -1 * offsetVector[0];
      // let yOffset = offsetVector[1];

      // let arrowVector = vec2.scale(vec2.create(), normalizedVector, 16);
      // let arrowOffsetX = arrowVector[0];
      // let arrowOffsetY = arrowVector[1];

      // let color0 = colors[pointIndex0];
      // let color1 = colors[pointIndex1];
 
      // first triangle of line
      // trianglePositions[trianglePositionsIndex++] = x0;
      // trianglePositions[trianglePositionsIndex++] = y0;
      // triangleNormals[triangleNormalsIndex++] = xOffset * -1;
      // triangleNormals[triangleNormalsIndex++] = yOffset;
      // triangleColors[triangleColorsIndex++] = color0;

      // trianglePositions[trianglePositionsIndex++] = x1;
      // trianglePositions[trianglePositionsIndex++] = y1;
      // triangleNormals[triangleNormalsIndex++] = xOffset * -1;
      // triangleNormals[triangleNormalsIndex++] = yOffset;
      // triangleColors[triangleColorsIndex++] = color1;

      // trianglePositions[trianglePositionsIndex++] = x0;
      // trianglePositions[trianglePositionsIndex++] = y0;
      // triangleNormals[triangleNormalsIndex++] = xOffset;
      // triangleNormals[triangleNormalsIndex++] = yOffset * -1;
      // triangleColors[triangleColorsIndex++] = color0;

      // // second triangle of line
      // trianglePositions[trianglePositionsIndex++] = x1;
      // trianglePositions[trianglePositionsIndex++] = y1;
      // triangleNormals[triangleNormalsIndex++] = xOffset;
      // triangleNormals[triangleNormalsIndex++] = yOffset * -1;
      // triangleColors[triangleColorsIndex++] = color1;

      // trianglePositions[trianglePositionsIndex++] = x0;
      // trianglePositions[trianglePositionsIndex++] = y0;
      // triangleNormals[triangleNormalsIndex++] = xOffset;
      // triangleNormals[triangleNormalsIndex++] = yOffset * -1;
      // triangleColors[triangleColorsIndex++] = color0;

      // trianglePositions[trianglePositionsIndex++] = x1;
      // trianglePositions[trianglePositionsIndex++] = y1;
      // triangleNormals[triangleNormalsIndex++] = xOffset * -1;
      // triangleNormals[triangleNormalsIndex++] = yOffset;
      // triangleColors[triangleColorsIndex++] = color1;


      // if (showArrows) {
      //   // triangle for arrow
      //   trianglePositions[trianglePositionsIndex++] = x1;
      //   trianglePositions[trianglePositionsIndex++] = y1;
      //   triangleNormals[triangleNormalsIndex++] = 0;
      //   triangleNormals[triangleNormalsIndex++] = 0;
      //   triangleColors[triangleColorsIndex++] = color1;

      //   trianglePositions[trianglePositionsIndex++] = x1;
      //   trianglePositions[trianglePositionsIndex++] = y1;
      //   triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetX + xOffset * ARROW_WIDTH_MULTIPLIER;
      //   triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetY + yOffset * -1 * ARROW_WIDTH_MULTIPLIER;
      //   triangleColors[triangleColorsIndex++] = color1;

      //   trianglePositions[trianglePositionsIndex++] = x1;
      //   trianglePositions[trianglePositionsIndex++] = y1;
      //   triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetX + xOffset * -1 * ARROW_WIDTH_MULTIPLIER;
      //   triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetY + yOffset * ARROW_WIDTH_MULTIPLIER;
      //   triangleColors[triangleColorsIndex++] = color1;
      // }
    }

    return {
      points: {
        positions: pointPositions,
        colors: pointColors
      },
      quads: {
        starts: quadStarts,
        ends: quadEnds,
        controls: quadControls,
        groups: quadGroups
      }
      // triangles: {
      //   positions: trianglePositions,
      //   normals: triangleNormals,
      //   colors: triangleColors
      // }
    };
  })
};

module.exports = VertexBridge;




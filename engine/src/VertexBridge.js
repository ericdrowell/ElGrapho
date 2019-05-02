const Profiler = require('./Profiler');
const glMatrix = require('gl-matrix');
const vec2 = glMatrix.vec2;
//const MAX_NODE_SIZE = 16;
const ARROW_WIDTH_MULTIPLIER = 4; // edge width times this number equals arrow width
 
const VertexBridge = {
  modelToVertices: Profiler('VertexBridges.modelToVertices', function(model, showArrows) {
    let nodes = model.nodes;
    let edges = model.edges;
    let positions = new Float32Array(nodes.length*2);
    //let halfWidth = width/2;
    //let halfHeight = height/2;
    let colors = new Float32Array(nodes.length);

    
    let positionCounter = 0;
    nodes.forEach(function(node, n) {
      // convert normalized x and y to pixel values
      //node.x *= halfWidth;
      //node.y *= halfHeight;

      positions[positionCounter++] = node.x;
      positions[positionCounter++] = node.y;

      colors[n] = node.group;
    });


    // one edge is defined by two elements (from and to).  each edge requires 2 triangles.  Each triangle has 3 positions, with an x and y for each
    let numEdges = edges.length;
    let numArrows = showArrows ? numEdges : 0;

    let trianglePositions = new Float32Array(numEdges * 12 + numArrows * 6);
    let triangleNormals = new Float32Array(numEdges * 12 + numArrows * 6);
    let triangleColors = new Float32Array(numEdges * 6 + numArrows * 6);

    let trianglePositionsIndex = 0;
    let triangleNormalsIndex = 0;
    let triangleColorsIndex = 0;

    function addLine(x0, y0, color0, x1, y1, color1) {
      let normal = getNormal(x0, y0, x1, y1);

      // first triangle of line
      trianglePositions[trianglePositionsIndex++] = x0;
      trianglePositions[trianglePositionsIndex++] = y0;
      triangleNormals[triangleNormalsIndex++] = normal.x * -1;
      triangleNormals[triangleNormalsIndex++] = normal.y;
      triangleColors[triangleColorsIndex++] = color0;

      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = normal.x * -1;
      triangleNormals[triangleNormalsIndex++] = normal.y;
      triangleColors[triangleColorsIndex++] = color1;

      trianglePositions[trianglePositionsIndex++] = x0;
      trianglePositions[trianglePositionsIndex++] = y0;
      triangleNormals[triangleNormalsIndex++] = normal.x;
      triangleNormals[triangleNormalsIndex++] = normal.y * -1;
      triangleColors[triangleColorsIndex++] = color0;

      // second triangle of line
      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = normal.x;
      triangleNormals[triangleNormalsIndex++] = normal.y * -1;
      triangleColors[triangleColorsIndex++] = color1;

      trianglePositions[trianglePositionsIndex++] = x0;
      trianglePositions[trianglePositionsIndex++] = y0;
      triangleNormals[triangleNormalsIndex++] = normal.x;
      triangleNormals[triangleNormalsIndex++] = normal.y * -1;
      triangleColors[triangleColorsIndex++] = color0;

      trianglePositions[trianglePositionsIndex++] = x1;
      trianglePositions[trianglePositionsIndex++] = y1;
      triangleNormals[triangleNormalsIndex++] = normal.x * -1;
      triangleNormals[triangleNormalsIndex++] = normal.y;
      triangleColors[triangleColorsIndex++] = color1;
    }

    function getDirection(x0, y0, x1, y1) {
      let vectorX = x1 - x0;
      let vectorY = y1 - y0;
      let vector = vec2.fromValues(vectorX, vectorY);

      return vector;
    }

    function getNormal(x0, y0, x1, y1) {
      let direction = getDirection(x0, y0, x1, y1);
      let normalizedVector = vec2.normalize(vec2.create(), direction);
      let perpVector = vec2.rotate(vec2.create(), normalizedVector, vec2.create(), Math.PI/2);
      let offsetVector = perpVector; // vec2.scale(vec2.create(), perpVector, normalDistance);
      let normalX = -1 * offsetVector[0];
      let normalY = offsetVector[1];

      return {
        x: normalX,
        y: normalY
      };
    }

    for (let n=0; n<numEdges; n++) {
      let pointIndex0 = edges[n].from;
      let pointIndex1 = edges[n].to;

      let x0 = nodes[pointIndex0].x;
      let x1 = nodes[pointIndex1].x;
      let y0 = nodes[pointIndex0].y;
      let y1 = nodes[pointIndex1].y;


      

      let color0 = colors[pointIndex0];
      let color1 = colors[pointIndex1];
 
      addLine(x0, y0, color0, x1, y1, color1);



      
      if (showArrows) {
        let direction = getDirection(x0, y0, x1, y1);
        let arrowVector = vec2.scale(vec2.create(), direction, 16);
        let arrowOffsetX = arrowVector[0];
        let arrowOffsetY = arrowVector[1];
        let normal = getNormal(x0, y0, x1, y1);

        // triangle for arrow
        trianglePositions[trianglePositionsIndex++] = x1;
        trianglePositions[trianglePositionsIndex++] = y1;
        triangleNormals[triangleNormalsIndex++] = 0;
        triangleNormals[triangleNormalsIndex++] = 0;
        triangleColors[triangleColorsIndex++] = color1;

        trianglePositions[trianglePositionsIndex++] = x1;
        trianglePositions[trianglePositionsIndex++] = y1;
        triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetX + normal.x * ARROW_WIDTH_MULTIPLIER;
        triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetY + normal.y * -1 * ARROW_WIDTH_MULTIPLIER;
        triangleColors[triangleColorsIndex++] = color1;

        trianglePositions[trianglePositionsIndex++] = x1;
        trianglePositions[trianglePositionsIndex++] = y1;
        triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetX + normal.x * -1 * ARROW_WIDTH_MULTIPLIER;
        triangleNormals[triangleNormalsIndex++] = -1 * arrowOffsetY + normal.y * ARROW_WIDTH_MULTIPLIER;
        triangleColors[triangleColorsIndex++] = color1;
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




//#version 300 es

attribute vec4 aVertexPosition;
attribute float aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform bool magicZoom;
uniform float nodeSize;
uniform float focusedGroup;
uniform int hoverNode;
uniform float zoom;

varying vec4 vVertexColor;

const float POINT_STROKE_WIDTH_FACTOR = 1.5;
const float MAX_NODE_SIZE = 16.0;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  //gl_Position.z = 0.0;

  if (magicZoom) {
    gl_PointSize = MAX_NODE_SIZE * POINT_STROKE_WIDTH_FACTOR; 
  }
  else {
    gl_PointSize = nodeSize * MAX_NODE_SIZE * zoom * POINT_STROKE_WIDTH_FACTOR;
  }

  
  if (focusedGroup == -1.0 || aVertexColor == focusedGroup) {
    gl_Position.z = -0.4;
  }
  else {
    gl_Position.z = -0.1;
  }

  // if (gl_VertexID == hoverNode) {
    
  //   vVertexColor = vec4(0.0, 0.0, 0.0, 1.0); 
  // }
  // else {
  vVertexColor = vec4(1.0, 1.0, 1.0, 1.0); 
  //}

  

}
#version 300 es

in vec4 aVertexPosition;
in float aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform bool magicZoom;
uniform float nodeSize;
uniform float focusedGroup;

out vec4 vVertexColor;

const float POINT_STROKE_WIDTH_FACTOR = 1.5;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  //gl_Position.z = 0.0;

  if (magicZoom) {
    gl_PointSize = nodeSize * POINT_STROKE_WIDTH_FACTOR; 
  }
  else {
    gl_PointSize = nodeSize * min(length(uModelViewMatrix[0]), length(uModelViewMatrix[1])) * POINT_STROKE_WIDTH_FACTOR;
  }

  
  if (focusedGroup == -1.0 || aVertexColor == focusedGroup) {
    gl_Position.z = -0.4;
  }
  else {
    gl_Position.z = -0.1;
  }

  vVertexColor = vec4(1.0, 1.0, 1.0, 1.0); 

}
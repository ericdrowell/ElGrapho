#version 300 es

in vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform bool magicZoom;
uniform float nodeSize;

out vec4 vVertexColor;

const float POINT_STROKE_WIDTH_FACTOR = 1.5;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

  if (magicZoom) {
    gl_PointSize = nodeSize * POINT_STROKE_WIDTH_FACTOR; 
  }
  else {
    gl_PointSize = nodeSize * min(length(uModelViewMatrix[0]), length(uModelViewMatrix[1])) * POINT_STROKE_WIDTH_FACTOR;
  }


  vVertexColor = vec4(1.0, 1.0, 1.0, 1.0); 

}
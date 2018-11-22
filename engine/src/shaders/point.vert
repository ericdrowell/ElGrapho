attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute float aVertexSize;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vVertexColor;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  // scale points with zoom.  Using scale of x component
  gl_PointSize = aVertexSize * length(uModelViewMatrix[0]);
  vVertexColor = aVertexColor;
}
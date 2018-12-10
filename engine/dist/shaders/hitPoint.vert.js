module.exports = `attribute vec4 aVertexPosition;

attribute float aVertexIndex;
attribute float aVertexSize;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vVertexColor;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  // scale points with zoom.  Using scale of x component
  gl_PointSize = aVertexSize * length(uModelViewMatrix[0]);

  vVertexColor = vec4(0.0, 0.0, aVertexIndex/255.0, 1.0); 
}`;
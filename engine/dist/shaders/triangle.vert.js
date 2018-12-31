module.exports = `attribute vec4 aVertexPosition;
attribute vec4 normal;
attribute float aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vVertexColor;
// https://mattdesl.svbtle.com/drawing-lines-is-hard
// https://github.com/mattdesl/three-line-2d/blob/master/shaders/basic.js
void main() {
  //gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  gl_Position = uProjectionMatrix * ((uModelViewMatrix * aVertexPosition) + vec4(normal.xyz, 0.0));

  if (aVertexColor == 0.0) {
    vVertexColor = vec4(1.0, 0.0, 0.0, 1.0); 
  }
  else if (aVertexColor == 1.0) {
    vVertexColor = vec4(0.0, 1.0, 0.0, 1.0);
  }
  else {
    vVertexColor = vec4(0.0, 0.0, 1.0, 1.0); 
  }
}`;
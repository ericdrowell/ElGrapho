attribute vec4 aVertexPosition;

attribute float aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vVertexColor;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  //vVertexColor = aVertexColor;

  //vVertexColor = aVertexColor;
  if (aVertexColor == 0.0) {
    vVertexColor = vec4(1.0, 0.0, 0.0, 1.0); 
  }
  else if (aVertexColor == 1.0) {
    vVertexColor = vec4(0.0, 1.0, 0.0, 1.0);
  }
  else {
    vVertexColor = vec4(0.0, 0.0, 1.0, 1.0); 
  }
}
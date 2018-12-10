attribute vec4 aVertexPosition;

attribute float aVertexColor;
attribute float aVertexSize;
attribute float aVertexFocused;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vVertexColor;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  // scale points with zoom.  Using scale of x component
  gl_PointSize = aVertexSize * length(uModelViewMatrix[0]);

  // normal color
  if (aVertexFocused == 0.0) {
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
  // focused color
  else {
    vVertexColor = vec4(0.0, 0.0, 1.0, 1.0); 
  }
}
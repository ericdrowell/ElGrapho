attribute vec4 aVertexPosition;

attribute float aVertexColor;
attribute float aVertexFocused;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vVertexColor;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  gl_PointSize = 16.0;

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
    // pink for now
    vVertexColor = vec4(255.0/255.0, 105.0/255.0, 147.0/255.0, 1.0); 
  }
}
//#version 300 es

//https://www.desultoryquest.com/blog/drawing-anti-aliased-circular-points-using-opengl-slash-webgl/
//#extension GL_OES_standard_derivatives : enable

// https://www.desultoryquest.com/blog/drawing-anti-aliased-circular-points-using-opengl-slash-webgl/
// https://www.desultoryquest.com/blog/downloads/code/points.js
precision mediump float;
varying vec4 vVertexColor;

void main(void) {
  float r = 0.0, delta = 0.0, alpha = 1.0;
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  r = dot(cxy, cxy);
  if (r > 1.0) {
    discard;
  }

  gl_FragColor = vVertexColor * alpha;
}
module.exports = `// use lowp for solid colors to improve perf
// https://stackoverflow.com/questions/13780609/what-does-precision-mediump-float-mean
precision lowp float;
varying vec4 vVertexColor;

void main(void) {
  gl_FragColor = vVertexColor;
}`;
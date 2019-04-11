#version 300 es

// use lowp for solid colors to improve perf
// https://stackoverflow.com/questions/13780609/what-does-precision-mediump-float-mean
precision mediump float;
in vec4 vVertexColor;
out vec4 fragColor;

void main(void) {
  fragColor = vVertexColor;
}
//#version 300 es

attribute vec4 aVertexPosition;
attribute vec4 normal;
attribute float aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform bool magicZoom;
uniform float nodeSize; // 0 - 1
uniform float focusedGroup;
uniform float edgeSize; // 0 - 1

const float MAX_NODE_SIZE = 16.0;
const float PI = 3.1415926535897932384626433832795;

varying vec4 vVertexColor;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

// https://mattdesl.svbtle.com/drawing-lines-is-hard
// https://github.com/mattdesl/three-line-2d/blob/master/shaders/basic.js
void main() {
  float zoomX = length(uModelViewMatrix[0]);
  float zoomY = length(uModelViewMatrix[1]);
  // vec2 standardZoomVector = normalize(vec2(1.0, 0.0));
  // vec2 zoomVector = normalize(vec2(zoomX, zoomY));
  // float zoomAngle = dot(standardZoomVector, zoomVector);
  // vec2 vec2Normal = vec2(normal.xy);
  // vec2 rotatedNormal = rotate(vec2Normal, zoomAngle);
  // vec4 newNormal = vec4(rotatedNormal.x, rotatedNormal.y, 0.0, 0.0);

  vec4 newNormal = MAX_NODE_SIZE * 0.25 * edgeSize * vec4(normal.x, normal.y, 0.0, 0.0);


  if (magicZoom) {
    gl_Position = uProjectionMatrix * ((uModelViewMatrix * aVertexPosition) + newNormal);
  }
  else {
    newNormal.x = newNormal.x * zoomX * nodeSize;
    newNormal.y = newNormal.y * zoomY * nodeSize;
    gl_Position = uProjectionMatrix * ((uModelViewMatrix * aVertexPosition) + newNormal);
  }

  //gl_Position.z = 0.0;
  
  bool isGray;

  if (focusedGroup == -1.0 || aVertexColor == focusedGroup) {
    isGray = false;
    gl_Position.z = -0.3;
  }
  else {
    isGray = true;
    gl_Position.z = 0.0;
  }

  float validColor = mod(aVertexColor, 8.0);

  if (isGray) {
    vVertexColor = vec4(220.0/255.0, 220.0/255.0, 220.0/255.0, 1.0); 
  }
  else if (validColor == 0.0) {
    vVertexColor = vec4(51.0/255.0, 102.0/255.0, 204.0/255.0, 1.0); // 3366CC
  }
  else if (validColor == 1.0) {
    vVertexColor = vec4(220.0/255.0, 57.0/255.0, 18.0/255.0, 1.0); // DC3912
  }
  else if (validColor == 2.0) {
    vVertexColor = vec4(255.0/255.0, 153.0/255.0, 0.0/255.0, 1.0); // FF9900
  }
  else if (validColor == 3.0) {
    vVertexColor = vec4(16.0/255.0, 150.0/255.0, 24.0/255.0, 1.0); // 109618
  }
  else if (validColor == 4.0) {
    vVertexColor = vec4(153.0/255.0, 0.0/255.0, 153.0/255.0, 1.0); // 990099
  }
  else if (validColor == 5.0) {
    vVertexColor = vec4(59.0/255.0, 62.0/255.0, 172.0/255.0, 1.0); // 3B3EAC
  }
  else if (validColor == 6.0) {
    vVertexColor = vec4(0.0/255.0, 153.0/255.0, 198.0/255.0, 1.0); // 0099C6
  }
  else if (validColor == 7.0) {
    vVertexColor = vec4(221.0/255.0, 68.0/255.0, 119.0/255.0, 1.0); // DD4477
  }
}
//#version 300 es


// globals
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform bool magicZoom;
uniform float nodeSize; // 0 - 1
uniform float focusedGroup;
uniform float edgeSize; // 0 - 1
uniform float zoom;

attribute vec2 start;
attribute vec2 end;
attribute vec2 control;
attribute float group;

const float MAX_NODE_SIZE = 16.0;
const float PI = 3.1415926535897932384626433832795;
const float subdivisions = 10.0;
const float thickness = 5.0;

varying vec4 vVertexColor;
//varying vec2 vCoord;

// https://mattdesl.svbtle.com/shaping-curves-with-parametric-equations
//https://observablehq.com/@mattdesl/2d-quadratic-curves-on-the-gpu
vec3 sample (float t) {
  // We can also adjust the per-vertex curve thickness by modifying this 0..1 number
  float volume = 1.0;

  // Try replacing the above with:
  // float volume = 1.0 * sin(t * PI);

  // Solve the quadratic curve with the start, control and end points:
  float dt = (1.0 - t);
  float dtSq = dt * dt;
  float tSq = t * t;
  float x = dtSq * start.x + 2.0 * dt * t * control.x + tSq * end.x;
  float y = dtSq * start.y + 2.0 * dt * t * control.y + tSq * end.y;
  return vec3(x, y, volume);

  // Alternatively, you can replace the above with a linear mix() operation
  // This will produce a straight line between the start and end points
  // return vec3(mix(start, end, t), volume);
}

void main() {

  // Get the "arc length" in 0..1 space
  float arclen = (position.x * 0.5 + 0.5);

  // How far to offset the line thickness for this vertex in -1..1 space
  float extrusion = position.y;

  // Find next sample along curve
  float nextArclen = arclen + (1.0 / subdivisions);

  // Sample the curve in two places
  // XY is the 2D position, and the Z component is the thickness at that vertex
  vec3 current = sample(arclen);
  vec3 next = sample(nextArclen);

  // Now find the 2D perpendicular to form our line segment
  vec2 direction = normalize(next.xy - current.xy);
  vec2 perpendicular = vec2(-direction.y, direction.x);

  // Extrude
  float computedExtrusion = extrusion * (thickness / 2.0) * current.z;
  vec3 offset = current.xyz + vec3(perpendicular.xy, 0.0) * computedExtrusion;

  // Compute final position
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(offset.xyz, 1.0);

  // Pass along the coordinates for texturing/effects
  //vCoord = position.xy;








  
  bool isGray;

  if (focusedGroup == -1.0 || group == focusedGroup) {
    isGray = false;
    gl_Position.z = -0.3;
  }
  else {
    isGray = true;
    gl_Position.z = 0.0;
  }

  float validColor = mod(group, 8.0);

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
const glMatrix = require('gl-matrix');
const mat4 = glMatrix.mat4;
const Concrete = require('../../../../concrete/build/concrete.js');
const pointVert = require('../dist/shaders/point.vert');
const hitPointVert = require('../dist/shaders/hitPoint.vert');
const triangleVert = require('../dist/shaders/triangle.vert');
const triangleFrag = require('../dist/shaders/triangle.frag');
const pointFrag = require('../dist/shaders/point.frag');
const Profiler = require('./Profiler');

let WebGL = function(config) {
  let layer = this.layer = config.layer;
  let gl = layer.scene.context;
  let hitGl = layer.hit.context;

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  hitGl.clearColor(1.0, 1.0, 1.0, 1.0);
  hitGl.enable(hitGl.DEPTH_TEST); 
};

WebGL.prototype = {
  getShader: function(type, str, gl) {
    let shader = gl.createShader(type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  },

  getPointShaderProgram: function() {
    let gl = this.layer.scene.context;
    let vertexShader = this.getShader('vertex', pointVert, gl);
    let fragmentShader = this.getShader('fragment', pointFrag, gl);
    let shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Could not initialise shaders');
    }

    gl.useProgram(shaderProgram);

    // attribute variables per data point
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.vertexFocusedAttribute = gl.getAttribLocation(shaderProgram, 'aVertexFocused');
    gl.enableVertexAttribArray(shaderProgram.vertexFocusedAttribute);

    // uniform constants for all data points
    shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    shaderProgram.modelViewMatrixUniform = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    shaderProgram.magicZoom = gl.getUniformLocation(shaderProgram, 'magicZoom');
    shaderProgram.nodeSize = gl.getUniformLocation(shaderProgram, 'nodeSize');

    return shaderProgram;
  },
  getHitPointShaderProgram: function() {
    let gl = this.layer.hit.context;
    let vertexShader = this.getShader('vertex', hitPointVert, gl);
    let fragmentShader = this.getShader('fragment', pointFrag, gl);
    let shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Could not initialise shaders');
    }

    gl.useProgram(shaderProgram);

    // attribute variables per data point
    shaderProgram.vertexIndexAttribute = gl.getAttribLocation(shaderProgram, 'aVertexIndex');
    gl.enableVertexAttribArray(shaderProgram.vertexIndexAttribute);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // uniform constants for all data points
    shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    shaderProgram.modelViewMatrixUniform = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    shaderProgram.magicZoom = gl.getUniformLocation(shaderProgram, 'magicZoom');
    shaderProgram.nodeSize = gl.getUniformLocation(shaderProgram, 'nodeSize');

    return shaderProgram;
  },

  getTriangleShaderProgram: function() {
    let gl = this.layer.scene.context;
    let vertexShader = this.getShader('vertex', triangleVert, gl);
    let fragmentShader = this.getShader('fragment', triangleFrag, gl);
    let shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Could not initialise shaders');
    }

    gl.useProgram(shaderProgram);

    // attribute variables per data point
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.normalsAttribute = gl.getAttribLocation(shaderProgram, 'normal');
    gl.enableVertexAttribArray(shaderProgram.normalsAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    // uniform constants for all data points
    shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    shaderProgram.modelViewMatrixUniform = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    shaderProgram.magicZoom = gl.getUniformLocation(shaderProgram, 'magicZoom');
    shaderProgram.nodeSize = gl.getUniformLocation(shaderProgram, 'nodeSize');

    return shaderProgram;
  },

  createIndices: function(size) {
    let arr = new Float32Array(size);
    arr.forEach(function(index, n) {
      arr[n] = n;
    });
    return arr;
  },

  initBuffers: Profiler('WebGL.initBuffers()', function(vertices) {
    this.buffers = {};

    if (vertices.points) {
      let size = vertices.points.positions.length/2;
      this.buffers.points = {
        positions: this.createBuffer(vertices.points.positions, 2, this.layer.scene.context),
        colors: this.createBuffer(vertices.points.colors, 1, this.layer.scene.context),
        focused: this.createBuffer(vertices.points.focused, 1, this.layer.scene.context),

        // unfortunately, have to have dedicated hitPositions because these buffers need to be bound
        // to a specific context.  Would be nice if I could work around this so that we aren't wasting so much buffer memory
        hitIndices: this.createBuffer(this.createIndices(size), 1, this.layer.hit.context),
        hitPositions: this.createBuffer(vertices.points.positions, 2, this.layer.hit.context)
      };
    }

    if (vertices.triangles) {
      this.buffers.triangles = {
        positions: this.createBuffer(vertices.triangles.positions, 2, this.layer.scene.context),
        normals: this.createBuffer(vertices.triangles.normals, 2, this.layer.scene.context),
        colors: this.createBuffer(vertices.triangles.colors, 1, this.layer.scene.context)
      };
    }
  }),
  createBuffer: function(vertices, itemSize, gl) {
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    vertexBuffer.itemSize = itemSize;
    vertexBuffer.numItems = vertices.length / vertexBuffer.itemSize;
    return vertexBuffer;
  },
  bindBuffer: function(buffer, attribute, gl) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute, buffer.itemSize, gl.FLOAT, false, 0, 0);
  },
  drawScenePoints: function(projectionMatrix, modelViewMatrix, magicZoom, nodeSize) {
    let layer = this.layer;
    let gl = layer.scene.context;
    let shaderProgram = this.getPointShaderProgram();
    let buffers = this.buffers.points;

    gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderProgram.modelViewMatrixUniform, false, modelViewMatrix);
    gl.uniform1i(shaderProgram.magicZoom, magicZoom);
    gl.uniform1f(shaderProgram.nodeSize, nodeSize);

    this.bindBuffer(buffers.positions, shaderProgram.vertexPositionAttribute, gl);
    this.bindBuffer(buffers.colors, shaderProgram.vertexColorAttribute, gl);
    this.bindBuffer(buffers.focused, shaderProgram.vertexFocusedAttribute, gl);

    gl.drawArrays(gl.POINTS, 0, buffers.positions.numItems);
  },
  drawSceneTriangles: function(projectionMatrix, modelViewMatrix, magicZoom, nodeSize) {
    let layer = this.layer;
    let gl = layer.scene.context;
    let shaderProgram = this.getTriangleShaderProgram();
    let buffers = this.buffers.triangles;
 
    gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderProgram.modelViewMatrixUniform, false, modelViewMatrix);
    gl.uniform1i(shaderProgram.magicZoom, magicZoom);
    gl.uniform1f(shaderProgram.nodeSize, nodeSize);

    this.bindBuffer(buffers.positions, shaderProgram.vertexPositionAttribute, gl);
    this.bindBuffer(buffers.normals, shaderProgram.normalsAttribute, gl);
    this.bindBuffer(buffers.colors, shaderProgram.vertexColorAttribute, gl);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    gl.drawArrays(gl.TRIANGLES, 0, buffers.positions.numItems);
  },
  drawScene: function(panX, panY, zoomX, zoomY, magicZoom, nodeSize) {
    let layer = this.layer;
    let gl = layer.scene.context;
    let modelViewMatrix = mat4.create();
    let projectionMatrix = mat4.create();

    // const fieldOfView = 45 * Math.PI / 180;   // in radians
    // const aspect = layer.width / layer.height;
    // const zNear = 0.01;
    // const zFar = 100000.0;

    let left = layer.width/2 *-1;
    let right = layer.width/2;
    let bottom = layer.height/2 *-1;
    let top = layer.height/2;
    let near = 0.01;
    let far = 100000.0;

    gl.viewport(0, 0, layer.width*Concrete.PIXEL_RATIO, layer.height*Concrete.PIXEL_RATIO);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    mat4.ortho(projectionMatrix, left, right, bottom, top, near, far);
    mat4.translate(modelViewMatrix, modelViewMatrix, [panX, panY, -1]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [zoomX, zoomY, 1]);

    //console.log(modelViewMatrix);

    if (this.buffers.points) {
      this.drawScenePoints(projectionMatrix, modelViewMatrix, magicZoom, nodeSize);
    }

    if (this.buffers.triangles) {
      this.drawSceneTriangles(projectionMatrix, modelViewMatrix, magicZoom, nodeSize);
    }
  },
  // TODO: need to abstract most of this away because it's copied from drawScene
  drawHit: function(panX, panY, zoomX, zoomY, magicZoom, nodeSize) {
    let layer = this.layer;
    let gl = layer.hit.context;
    let modelViewMatrix = mat4.create();
    let projectionMatrix = mat4.create();
    //let shaderProgram = this.shaderPrograms.hit;
    let shaderProgram = this.getHitPointShaderProgram();

    let pointBuffers = this.buffers.points;

    // const fieldOfView = 45 * Math.PI / 180;   // in radians
    // const aspect = layer.width / layer.height;
    // const zNear = 0.01;
    // const zFar = 100000.0;

    let left = layer.width/2 *-1;
    let right = layer.width/2;
    let bottom = layer.height/2 * -1;
    let top = layer.height/2;
    let near = 0.01;
    let far = 100000.0;

    gl.viewport(0, 0, layer.width*Concrete.PIXEL_RATIO, layer.height*Concrete.PIXEL_RATIO);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    mat4.ortho(projectionMatrix, left, right, bottom, top, near, far);
    mat4.translate(modelViewMatrix, modelViewMatrix, [panX, panY, -1]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [zoomX, zoomY, 1]);

    gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderProgram.modelViewMatrixUniform, false, modelViewMatrix);
    gl.uniform1i(shaderProgram.magicZoom, magicZoom);
    gl.uniform1f(shaderProgram.nodeSize, nodeSize);

    this.bindBuffer(pointBuffers.hitIndices, shaderProgram.vertexIndexAttribute, gl);
    this.bindBuffer(pointBuffers.hitPositions, shaderProgram.vertexPositionAttribute, gl);

    // TODO: maybe num items should be stored in a different way?
    gl.drawArrays(gl.POINTS, 0, pointBuffers.positions.numItems);
  }

};

module.exports = WebGL;
const glMatrix = require('gl-matrix');
const mat4 = glMatrix.mat4;
const Concrete = require('concretejs');
const pointVert = require('../dist/shaders/point.vert');
const pointStrokeVert = require('../dist/shaders/pointStroke.vert');
const hitPointVert = require('../dist/shaders/hitPoint.vert');
const triangleVert = require('../dist/shaders/triangle.vert');
const triangleFrag = require('../dist/shaders/triangle.frag');
const pointFrag = require('../dist/shaders/point.frag');
const pointHitFrag = require('../dist/shaders/pointHit.frag');
const Profiler = require('./Profiler');

let WebGL = function(config) {
  this.layer = config.layer;
  //let gl = layer.scene.context;
  //let hitGl = layer.hit.context;

  //gl.enable(gl.DEPTH_TEST);
  //gl.enable(gl.BLEND);

  //hitGl.enable(hitGl.DEPTH_TEST); 
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

    // uniform constants for all data points
    shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    shaderProgram.modelViewMatrixUniform = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    shaderProgram.magicZoom = gl.getUniformLocation(shaderProgram, 'magicZoom');
    shaderProgram.nodeSize = gl.getUniformLocation(shaderProgram, 'nodeSize');
    shaderProgram.focusedGroup = gl.getUniformLocation(shaderProgram, 'focusedGroup');
    shaderProgram.zoom = gl.getUniformLocation(shaderProgram, 'zoom');
    shaderProgram.globalAlpha = gl.getUniformLocation(shaderProgram, 'globalAlpha');
    shaderProgram.darkMode = gl.getUniformLocation(shaderProgram, 'darkMode');
    

    return shaderProgram;
  },

  getPointStrokeShaderProgram: function() {
    let gl = this.layer.scene.context;
    let vertexShader = this.getShader('vertex', pointStrokeVert, gl);
    let fragmentShader = this.getShader('fragment', pointFrag, gl);
    let shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Could not initialise shaders');
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    // uniform constants for all data points
    shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    shaderProgram.modelViewMatrixUniform = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    shaderProgram.magicZoom = gl.getUniformLocation(shaderProgram, 'magicZoom');
    shaderProgram.nodeSize = gl.getUniformLocation(shaderProgram, 'nodeSize');
    shaderProgram.focusedGroup = gl.getUniformLocation(shaderProgram, 'focusedGroup');
    shaderProgram.hoverNode = gl.getUniformLocation(shaderProgram, 'hoverNode');
    shaderProgram.zoom = gl.getUniformLocation(shaderProgram, 'zoom');
    shaderProgram.darkMode = gl.getUniformLocation(shaderProgram, 'darkMode');

    return shaderProgram;
  },

  getHitPointShaderProgram: function() {
    let gl = this.layer.hit.context;
    let vertexShader = this.getShader('vertex', hitPointVert, gl);
    let fragmentShader = this.getShader('fragment', pointHitFrag, gl);
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
    shaderProgram.zoom = gl.getUniformLocation(shaderProgram, 'zoom');

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
    shaderProgram.edgeSize = gl.getUniformLocation(shaderProgram, 'edgeSize');
    shaderProgram.focusedGroup = gl.getUniformLocation(shaderProgram, 'focusedGroup');
    shaderProgram.zoom = gl.getUniformLocation(shaderProgram, 'zoom');
    shaderProgram.globalAlpha = gl.getUniformLocation(shaderProgram, 'globalAlpha');
    shaderProgram.darkMode = gl.getUniformLocation(shaderProgram, 'darkMode');

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
  drawScenePoints: function(projectionMatrix, modelViewMatrix, magicZoom, nodeSize, focusedGroup, zoom, glowBlend, darkMode) {
    let layer = this.layer;
    let gl = layer.scene.context;
    let shaderProgram = this.getPointShaderProgram();
    let buffers = this.buffers.points;

    

    gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderProgram.modelViewMatrixUniform, false, modelViewMatrix);
    gl.uniform1i(shaderProgram.magicZoom, magicZoom);
    gl.uniform1f(shaderProgram.nodeSize, nodeSize);
    gl.uniform1f(shaderProgram.focusedGroup, focusedGroup);
    gl.uniform1f(shaderProgram.zoom, zoom);
    gl.uniform1f(shaderProgram.globalAlpha, 1-glowBlend);
    gl.uniform1i(shaderProgram.darkMode, darkMode);

    this.bindBuffer(buffers.positions, shaderProgram.vertexPositionAttribute, gl);
    this.bindBuffer(buffers.colors, shaderProgram.vertexColorAttribute, gl);

    gl.drawArrays(gl.POINTS, 0, buffers.positions.numItems);
  },
  drawScenePointStrokes: function(projectionMatrix, modelViewMatrix, magicZoom, nodeSize, focusedGroup, hoverNode, zoom, darkMode) {
    let layer = this.layer;
    let gl = layer.scene.context;
    let shaderProgram = this.getPointStrokeShaderProgram();
    let buffers = this.buffers.points;

    gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderProgram.modelViewMatrixUniform, false, modelViewMatrix);
    gl.uniform1i(shaderProgram.magicZoom, magicZoom);
    gl.uniform1f(shaderProgram.nodeSize, nodeSize);
    gl.uniform1f(shaderProgram.focusedGroup, focusedGroup);
    gl.uniform1i(shaderProgram.hoverNode, hoverNode);
    gl.uniform1f(shaderProgram.zoom, zoom);
    gl.uniform1i(shaderProgram.darkMode, darkMode);

    this.bindBuffer(buffers.positions, shaderProgram.vertexPositionAttribute, gl);
    this.bindBuffer(buffers.colors, shaderProgram.vertexColorAttribute, gl);

    gl.drawArrays(gl.POINTS, 0, buffers.positions.numItems);
  },
  drawSceneTriangles: function(projectionMatrix, modelViewMatrix, magicZoom, nodeSize, focusedGroup, edgeSize, zoom, glowBlend, darkMode) {
    let layer = this.layer;
    let gl = layer.scene.context;
    let shaderProgram = this.getTriangleShaderProgram();
    let buffers = this.buffers.triangles;

    gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderProgram.modelViewMatrixUniform, false, modelViewMatrix);
    gl.uniform1i(shaderProgram.magicZoom, magicZoom);
    gl.uniform1f(shaderProgram.nodeSize, nodeSize);
    gl.uniform1f(shaderProgram.edgeSize, edgeSize);
    gl.uniform1f(shaderProgram.focusedGroup, focusedGroup);
    gl.uniform1f(shaderProgram.zoom, zoom);
    gl.uniform1f(shaderProgram.globalAlpha, 1-glowBlend);
    gl.uniform1i(shaderProgram.darkMode, darkMode);

    this.bindBuffer(buffers.positions, shaderProgram.vertexPositionAttribute, gl);
    this.bindBuffer(buffers.normals, shaderProgram.normalsAttribute, gl);
    this.bindBuffer(buffers.colors, shaderProgram.vertexColorAttribute, gl);
    
    gl.drawArrays(gl.TRIANGLES, 0, buffers.positions.numItems);
  },
  drawScene: function(width, height, panX, panY, zoomX, zoomY, magicZoom, nodeSize, focusedGroup, hoverNode, edgeSize, darkMode, glowBlend, nodeOutline) {
    let layer = this.layer;
    let gl = layer.scene.context;
    let zoom = Math.min(zoomX, zoomY);

    


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
    let near = -1.0;
    let far = 11.0;

    //console.log(layer.width*Concrete.PIXEL_RATIO, layer.height*Concrete.PIXEL_RATIO);

    gl.viewport(0, 0, layer.width*Concrete.PIXEL_RATIO, layer.height*Concrete.PIXEL_RATIO);

    if (darkMode) {
      gl.clearColor(0, 0, 0, 1);
    }
    else {
      gl.clearColor(1, 1, 1, 1);
    }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // To disable the background color of the canvas element
    mat4.ortho(projectionMatrix, left, right, bottom, top, near, far);

    mat4.translate(modelViewMatrix, modelViewMatrix, [panX, panY, 0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [width/2, height/2, 1]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [zoomX, zoomY, 1]);

    //console.log(modelViewMatrix);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);

    if (glowBlend === 0) {
      gl.enable(gl.DEPTH_TEST);
    }
    else {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }

    if (this.buffers.triangles) {
      this.drawSceneTriangles(projectionMatrix, modelViewMatrix, magicZoom, nodeSize, focusedGroup, edgeSize, zoom, glowBlend, darkMode);
    }

    if (this.buffers.points) {

      if (nodeOutline) {
        this.drawScenePointStrokes(projectionMatrix, modelViewMatrix, magicZoom, nodeSize, focusedGroup, hoverNode, zoom, darkMode);
      }
      this.drawScenePoints(projectionMatrix, modelViewMatrix, magicZoom, nodeSize, focusedGroup, zoom, glowBlend, darkMode);
    }




  },
  // TODO: need to abstract most of this away because it's copied from drawScene
  drawHit: function(width, height, panX, panY, zoomX, zoomY, magicZoom, nodeSize) {
    let layer = this.layer;
    let gl = layer.hit.context;

    let zoom = Math.min(zoomX, zoomY);

    


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
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    mat4.ortho(projectionMatrix, left, right, bottom, top, near, far);
    mat4.translate(modelViewMatrix, modelViewMatrix, [panX, panY, -1]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [width/2, height/2, 1]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [zoomX, zoomY, 1]);

    gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderProgram.modelViewMatrixUniform, false, modelViewMatrix);
    gl.uniform1i(shaderProgram.magicZoom, magicZoom);
    gl.uniform1f(shaderProgram.nodeSize, nodeSize);
    gl.uniform1f(shaderProgram.zoom, zoom);

    this.bindBuffer(pointBuffers.hitIndices, shaderProgram.vertexIndexAttribute, gl);
    this.bindBuffer(pointBuffers.hitPositions, shaderProgram.vertexPositionAttribute, gl);

    gl.enable(gl.DEPTH_TEST); 

    // TODO: maybe num items should be stored in a different way?
    gl.drawArrays(gl.POINTS, 0, pointBuffers.positions.numItems);
  }

};

module.exports = WebGL;
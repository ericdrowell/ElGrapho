const ElGrapho = require('../../engine/src/ElGrapho');
const VertexBridges = ElGrapho.VertexBridges;
const NumberFormatter = ElGrapho.NumberFormatter;

const WIDTH = 500;
const HEIGHT = 500;

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


// const NUM_POINTS = 100;
// const MIN_POINT_SIZE = 8;
// const MAX_POINT_SIZE = 30;
// const EDGE_SIZE = 0.5;
// let pointVertices = VertexBridges.getRandomClusteredGraphPoints(NUM_POINTS, WIDTH, HEIGHT, MIN_POINT_SIZE, MAX_POINT_SIZE);
// let triangleVertices = VertexBridges.getGraphTriangles(pointVertices, 1, EDGE_SIZE);



// const NUM_POINTS = 1000;
// const MIN_POINT_SIZE = 8;
// const MAX_POINT_SIZE = 30;
// const EDGE_SIZE = 0.5;
// let pointVertices = VertexBridges.getRandomClusteredGraphPoints(NUM_POINTS, WIDTH, HEIGHT, MIN_POINT_SIZE, MAX_POINT_SIZE);
// let triangleVertices = VertexBridges.getGraphTriangles(pointVertices, 1, EDGE_SIZE);



// const NUM_POINTS = 10000;
// const POINT_SIZE = 10;
// const MIN_POINT_SIZE = 4;
// const MAX_POINT_SIZE = 10;
// const EDGE_SIZE = 0.2;
// let pointVertices = VertexBridges.getRandomClusteredGraphPoints(NUM_POINTS, WIDTH, HEIGHT, MIN_POINT_SIZE, MAX_POINT_SIZE);
// let triangleVertices = VertexBridges.getGraphTriangles(pointVertices, 1, EDGE_SIZE);



// const NUM_POINTS = 100000;
// const POINT_SIZE = 10;
// const MIN_POINT_SIZE = 4;
// const MAX_POINT_SIZE = 10;
// const EDGE_SIZE = 0.2;
// let pointVertices = VertexBridges.getRandomClusteredGraphPoints(NUM_POINTS, WIDTH, HEIGHT, MIN_POINT_SIZE, MAX_POINT_SIZE);
// let triangleVertices = VertexBridges.getGraphTriangles(pointVertices, 1, EDGE_SIZE);


let EXAMPLE_CONFIGS = [
  // 0 --------------------------------------------------------
  function() {
    let points = VertexBridges.getRandomPoints({
      numPoints: 100,
      width: WIDTH,
      height: HEIGHT,
      pointSize: 10
    });

    return {
      description: '100 point scatter',
      vertices: {
        points: points
      },
      renderingMode: 'ux'
    };
  },
  // 1 --------------------------------------------------------
  function() {
    let points = VertexBridges.getRandomPoints({
      numPoints: 100000,
      width: WIDTH,
      height: HEIGHT,
      pointSize: 3
    });

    return {
      description: '100k point scatter',
      vertices: {
        points: points
      },
      renderingMode: 'ux'
    };
  },
  // 2 --------------------------------------------------------
  function() {
    let points = VertexBridges.getRandomPoints({
      numPoints: 1000000,
      width: WIDTH,
      height: HEIGHT,
      pointSize: 1
    });

    return {
      description: '1M point scatter',
      vertices: {
        points: points
      },
      renderingMode: 'ux'
    };
  },
  // 3 --------------------------------------------------------
  function() {
    let points = VertexBridges.getRandomPoints({
      numPoints: 10000000,
      width: WIDTH,
      height: HEIGHT,
      pointSize: 0.2
    });

    return {
      description: '10M point scatter',
      vertices: {
        points: points
      },
      renderingMode: 'ux'
    };
  },
  // 4 --------------------------------------------------------
  function() {
    let points = VertexBridges.getRandomClusteredGraphPoints({
      numPoints: 100,
      width: WIDTH,
      height: HEIGHT,
      minPointSize: 8,
      maxPointSize: 16
    });

    let triangles = VertexBridges.getGraphTriangles({
      points: points, 
      maxConnectionsPerNode: 1,
      edgeSize: 0.4
    });

    return {
      description: '100 node clustered graph',
      vertices: {
        points: points,
        triangles: triangles
      },
      renderingMode: 'ux'
    };
  },
  // 5 --------------------------------------------------------
  function() {
    let points = VertexBridges.getRandomClusteredGraphPoints({
      numPoints: 1000,
      width: WIDTH,
      height: HEIGHT,
      minPointSize: 4,
      maxPointSize: 8
    });

    let triangles = VertexBridges.getGraphTriangles({
      points: points, 
      maxConnectionsPerNode: 1,
      edgeSize: 0.3
    });

    return {
      description: '1k node clustered graph',
      vertices: {
        points: points,
        triangles: triangles
      },
      renderingMode: 'ux'
    };
  },
  // 6 --------------------------------------------------------
  function() {
    let points = VertexBridges.getRandomClusteredGraphPoints({
      numPoints: 10000,
      width: WIDTH,
      height: HEIGHT,
      minPointSize: 1,
      maxPointSize: 2
    });

    let triangles = VertexBridges.getGraphTriangles({
      points: points, 
      maxConnectionsPerNode: 1,
      edgeSize: 0.05
    });

    return {
      description: '10k node clustered graph',
      vertices: {
        points: points,
        triangles: triangles
      },
      renderingMode: 'ux'
    };
  },
  // 7 --------------------------------------------------------
  function() {
    let points = VertexBridges.getRandomClusteredGraphPoints({
      numPoints: 100000,
      width: WIDTH,
      height: HEIGHT,
      minPointSize: 0.2,
      maxPointSize: 0.4
    });

    let triangles = VertexBridges.getGraphTriangles({
      points: points, 
      maxConnectionsPerNode: 1,
      edgeSize: 0.01
    });

    return {
      description: '100k node clustered graph',
      vertices: {
        points: points,
        triangles: triangles
      },
      renderingMode: 'performance'
    };
  },
  // 8 --------------------------------------------------------
  function() {
    let points = VertexBridges.getRandomClusteredGraphPoints({
      numPoints: 1000000,
      width: WIDTH,
      height: HEIGHT,
      minPointSize: 0.2,
      maxPointSize: 0.3
    });

    let triangles = VertexBridges.getGraphTriangles({
      points: points, 
      maxConnectionsPerNode: 1,
      edgeSize: 0.005
    });

    return {
      description: '1M node clustered graph',
      vertices: {
        points: points,
        triangles: triangles
      },
      renderingMode: 'performance'
    };
  }
];

let configIndex = getParameterByName('config') || 0;

let config = EXAMPLE_CONFIGS[configIndex]();

var graph = new ElGrapho({
  container: document.getElementById('container'),
  vertices: config.vertices,
  width: WIDTH,
  height: HEIGHT,
  components: {
    tooltip: {
      template: function(index) {
        this.wrapper.innerHTML = 'My Data: ' + NumberFormatter.addCommas(index);
      }
    }
  },
  renderingMode: config.renderingMode
});



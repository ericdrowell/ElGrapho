const UUID = require('./UUID');
const WebGL = require('./WebGL');
const Profiler = require('./Profiler');
const ElGraphoCollection = require('./ElGraphoCollection');
const Controls = require('./components/Controls/Controls');
const Count = require('./components/Count/Count');
const Events = require('./Events');
//const Concrete = require('../../../../concrete/build/concrete.js');
const Concrete = require('concretejs');
const _ = require('lodash');
const Color = require('./Color');
const Theme = require('./Theme');
const Tooltip = require('./components/Tooltip/Tooltip');
const NumberFormatter = require('./formatters/NumberFormatter');
const VertexBridges = require('./VertexBridges');
const Enums = require('./Enums');

const ZOOM_FACTOR = 2;
const START_SCALE = 1;

let ElGrapho = Profiler('ElGrapho.constructor', function(config) {
  this.container = config.container || document.createElement('div');
  this.id = UUID.generate();
  this.dirty = true;
  this.hitDirty = true;
  this.scale = START_SCALE;
  this.panX = 0;
  this.panY = 0;
  this.events = new Events();
  this.width = config.width;
  this.height = config.height;
  this.animations = [];
  this.wrapper = document.createElement('div');
  this.wrapper.className = 'el-grapho-wrapper';
  this.wrapper.style.width = this.width + 'px';
  this.wrapper.style.height = this.height + 'px';
  this.container.appendChild(this.wrapper);
  this.defaultComponents(config);
  this.components = config.components;
  this.renderingMode = config.renderingMode === undefined ? Enums.renderingMode.PERFORMANCE : config.renderingMode;
  this.setInteractionMode(Enums.interactionMode.SELECT);
  this.panStart = null;
  // default tooltip template
  this.tooltipTemplate = function(index, el) {
    el.innerHTML = ElGrapho.NumberFormatter.addCommas(index);
  };
  this.hoveredDataIndex = -1;

  let viewport = this.viewport = new Concrete.Viewport({
    container: this.wrapper,
    width: this.width,
    height: this.height
  });

  let mainLayer = new Concrete.Layer({
    contextType: 'webgl'
  });

  viewport.add(mainLayer);


  let webgl = this.webgl = new WebGL({
    layer: mainLayer
  });

  //webgl.initShaders();

  if (!ElGraphoCollection.initialized) {
    ElGraphoCollection.init();
  }



  // mainLayer.hit.canvas.style.display = 'inline-block';
  // mainLayer.hit.canvas.style.marginLeft = '10px';
  // this.wrapper.appendChild(mainLayer.hit.canvas);


  let vertices = this.vertices = config.vertices;



  webgl.initBuffers(vertices);
  
  this.count = new Count({
    container: this.wrapper,
    vertices: vertices
  });

  this.controls = new Controls({
    container: this.wrapper,
    graph: this
  });

  this.listen();

  // add self to dashboard
  ElGraphoCollection.graphs.push(this);

});

ElGrapho.prototype = {
  defaultComponents: function(config) {
    if (!config.components) {
      config.components = {};
    }
    if (!config.components.tooltip) {
      config.components.tooltip = {};
    }
    if (!config.components.tooltip.template) {
      config.components.tooltip.template = Tooltip.DEFAULT_TEMPLATE;
    }

    return config;
  },
  getMousePosition(evt) {
    let boundingRect = this.wrapper.getBoundingClientRect();
    let x = evt.clientX - boundingRect.left;
    let y = evt.clientY - boundingRect.top;

    return {
      x: x,
      y: y
    };
  },
  listen: function() {
    let that = this;
    let viewport = this.viewport;

    this.on('zoom-in', function() {
      that.zoomIn();
    });

    this.on('zoom-out', function() {
      that.zoomOut();
    });

    this.on('reset', function() {
      that.reset();
    });

    this.on('select', function() {
      that.setInteractionMode(Enums.interactionMode.SELECT);
    });

    this.on('pan', function() {
      that.setInteractionMode(Enums.interactionMode.PAN);
    });

    viewport.container.addEventListener('mousedown', function(evt) {
      if (that.interactionMode === Enums.interactionMode.PAN) {
        let mousePos = that.getMousePosition(evt);
        that.panStart = mousePos;
        Tooltip.hide();

      }
    });

    viewport.container.addEventListener('mousemove', _.throttle(function(evt) {
      let mousePos = that.getMousePosition(evt);
      let dataIndex = viewport.getIntersection(mousePos.x, mousePos.y);

      // if panning
      if (that.panStart) {
        let mouseDiff = {
          x: mousePos.x - that.panStart.x,
          y: mousePos.y - that.panStart.y
        };

        viewport.scene.canvas.style.marginLeft = mouseDiff.x + 'px';
        viewport.scene.canvas.style.marginTop = mouseDiff.y + 'px';
      }
      else {
        // if pixel data is not white (empty)
        if (dataIndex === -1) {
          Tooltip.hide();
        }
        else {
          Tooltip.render(dataIndex, evt.clientX, evt.clientY, that.tooltipTemplate);
        }


        // change point state
        if (dataIndex !== that.hoveredDataIndex) {
          if (that.hoveredDataIndex > -1) {
            that.vertices.points.focused[that.hoveredDataIndex] = 0;
          }

          that.vertices.points.focused[dataIndex] = 1;
          that.webgl.initBuffers(that.vertices);
          that.dirty = true;
          that.hoveredDataIndex = dataIndex;          
        }
      }
    }));

    viewport.container.addEventListener('mouseup', function(evt) {
      if (that.interactionMode === Enums.interactionMode.PAN) {
        let mousePos = that.getMousePosition(evt);

        let mouseDiff = {
          x: mousePos.x - that.panStart.x,
          y: mousePos.y - that.panStart.y
        };

        that.panX += mouseDiff.x;
        that.panY -= mouseDiff.y;

        that.panStart = null;

        viewport.scene.canvas.style.marginLeft = 0;
        viewport.scene.canvas.style.marginTop = 0;

        that.dirty = true;
        that.hitDirty = true;
      }
    });

    viewport.container.addEventListener('mouseout', _.throttle(function() {
      Tooltip.hide();
    }));
  },
  setInteractionMode: function(mode) {
    this.interactionMode = mode;
    this.wrapper.className = 'el-grapho-wrapper el-grapho-' + mode + '-interaction-mode';
  },
  zoomOut: function() {
    if (this.renderingMode === Enums.renderingMode.PERFORMANCE) {
      this.scale/=ZOOM_FACTOR;
      this.dirty = true;
      this.hitDirty = true;
    }
    else {
      this.animations = [];

      let that = this;
      this.animations.push({
        startVal: that.scale,
        endVal: that.scale/ZOOM_FACTOR,
        startTime: new Date().getTime(),
        endTime: new Date().getTime() + 300,
        prop: 'scale'
      });
      this.dirty = true;
    }
  },
  zoomIn: function() {
    if (this.renderingMode === Enums.renderingMode.PERFORMANCE) {
      this.scale*=ZOOM_FACTOR;
      this.dirty = true;
      this.hitDirty = true;
    }
    else {
      this.animations = [];

      let that = this;
      this.animations.push({
        startVal: that.scale,
        endVal: that.scale*ZOOM_FACTOR,
        startTime: new Date().getTime(),
        endTime: new Date().getTime() + 300,
        prop: 'scale'
      });
      this.dirty = true;
    }
  },
  reset: function() {
    if (this.renderingMode === Enums.renderingMode.PERFORMANCE) {
      this.scale = START_SCALE;
      this.panX = 0;
      this.panY = 0;
      this.dirty = true;
      this.hitDirty = true;
    }
    else {
      this.animations = [];

      let that = this;
      this.animations.push({
        startVal: that.scale,
        endVal: START_SCALE,
        startTime: new Date().getTime(),
        endTime: new Date().getTime() + 300,
        prop: 'scale'
      });

      this.animations.push({
        startVal: that.panX,
        endVal: 0,
        startTime: new Date().getTime(),
        endTime: new Date().getTime() + 300,
        prop: 'panX'
      });

      this.animations.push({
        startVal: that.panY,
        endVal: 0,
        startTime: new Date().getTime(),
        endTime: new Date().getTime() + 300,
        prop: 'panY'
      });

      this.dirty = true;
    }
  },
  on: function(name, func) {
    this.events.on(name, func);
  },
  fire: function(name, evt) {
    this.events.fire(name, evt);
  }
};

// export modules
ElGrapho.Theme = Theme;
ElGrapho.Color = Color;
ElGrapho.Profiler = Profiler;
ElGrapho.NumberFormatter = NumberFormatter;
ElGrapho.VertexBridges = VertexBridges;

module.exports = ElGrapho;

if (window) {
  window.ElGrapho = ElGrapho;
}
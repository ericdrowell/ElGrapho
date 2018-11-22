const zoomInIcon = require('../../../dist/icons/zoomInIcon.svg');
const zoomOutIcon = require('../../../dist/icons/zoomOutIcon.svg');
const moveIcon = require('../../../dist/icons/moveIcon.svg');
const selectIcon = require('../../../dist/icons/selectIcon.svg');
const resetIcon = require('../../../dist/icons/resetIcon.svg');

const Controls = function(config) {
  this.graph = config.graph;
  this.container = config.container;
  this.wrapper = document.createElement('div');
  this.wrapper.className = 'el-grapho-controls';

  this.container.appendChild(this.wrapper);

  this.selectButton = this.addButton({
    icon: selectIcon,
    evtName: 'select'
  });
  this.panButton = this.addButton({
    icon: moveIcon,
    evtName: 'pan'
  });
  this.resetButton = this.addButton({
    icon: resetIcon,
    evtName: 'reset'
  });
  this.zoomInButton = this.addButton({
    icon: zoomInIcon,
    evtName: 'zoom-in'
  });
  this.zoomOutButton = this.addButton({
    icon: zoomOutIcon,
    evtName: 'zoom-out'
  });


};

Controls.prototype = {
  addButton: function(config) {
    let button = document.createElement('button');
    button.className = 'el-grapho-' + config.evtName + '-control';
    let graph = this.graph;

    button.innerHTML = config.icon;

    button.addEventListener('click', function() {
      graph.fire(config.evtName);
    });

    this.wrapper.appendChild(button);

    return button;
  }
};

module.exports = Controls;
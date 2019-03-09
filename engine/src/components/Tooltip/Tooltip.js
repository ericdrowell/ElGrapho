const Dom = require('../../Dom');

const Tooltip = {
  DEFAULT_TEMPLATE: function(index) {
    this.wrapper.innerHTML = index;
  },
  initialized: false,
  init: function() {
    Tooltip.wrapper = Dom.create('el-grapho-tooltip');
    document.body.appendChild(this.wrapper);
    Tooltip.initialized = true;
  },
  render: function(index, x, y, template) {
    if (!Tooltip.initialized) {
      Tooltip.init();
    }

    Tooltip.wrapper.style.display = 'inline-block';
    Tooltip.wrapper.style.left = x + 'px';
    Tooltip.wrapper.style.bottom = (window.innerHeight - y + 10) + 'px';

    template(index, this.wrapper);
  },
  hide: function() {
    if (!Tooltip.initialized) {
      Tooltip.init();
    }

    Tooltip.wrapper.style.display = 'none';
  }
};

module.exports = Tooltip;
const Dom = require('../../Dom');

const Tooltip = {
  DEFAULT_TEMPLATE: function(index) {
    this.wrapper.innerHTML = index;
  },
  initialized: false,
  init: function() {
    Tooltip.wrapper = Dom.create('tooltip');
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

    template.call(Tooltip, index);
  },
  hide: function() {
    if (!Tooltip.initialized) {
      Tooltip.init();
    }

    Tooltip.wrapper.style.display = 'none';
  }
};

module.exports = Tooltip;
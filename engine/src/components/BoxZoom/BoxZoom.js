const Dom = require('../../Dom');

let BoxZoom = {
  active: false,
  x: null,
  y: null,
  el: null,
  create: function(x, y) {

    BoxZoom.anchorX = x;
    BoxZoom.anchorY = y;

    BoxZoom.destroy();

    let el = Dom.create('el-grapho-box-zoom-component');
    document.body.appendChild(el);

    let verticalBar = Dom.create('el-grapho-vertical-bar');
    el.appendChild(verticalBar);

    let horizontalBar = Dom.create('el-grapho-horizontal-bar');
    el.appendChild(horizontalBar);

    BoxZoom.el = el;

    BoxZoom.active = true;

  },
  update: function(x, y) {
    if (BoxZoom.active) {
      let x0, x1, y0, y1;

      if (x > BoxZoom.anchorX) {
        x0 = BoxZoom.anchorX;
        x1 = x;
      }
      else {
        x0 = x;
        x1 = BoxZoom.anchorX;      
      }

      if (y > BoxZoom.anchorY) {
        y0 = BoxZoom.anchorY;
        y1 = y;
      }
      else {
        y0 = y;
        y1 = BoxZoom.anchorY;      
      }

      let width = x1 - x0;
      let height = y1 - y0;

      BoxZoom.el.style.left = Math.floor(x0) + 'px';
      BoxZoom.el.style.top = Math.floor(y0) + 'px';
      BoxZoom.el.style.width = Math.floor(width) + 'px';
      BoxZoom.el.style.height = Math.floor(height) + 'px';
    }


  },
  destroy: function() {
    let el = document.querySelector('.el-grapho-box-zoom-component');

    if (el) {
      el.remove();
    }

    BoxZoom.active = false;
  }
};

module.exports = BoxZoom;
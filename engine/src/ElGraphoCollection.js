const EasingFunctions = require('./EasingFunctions');
const styles = require('../dist/styles/ElGrapho.min.css.js');

let ElGraphoCollection = {
  graphs: [],
  initialized: false,
  init: function() {
    ElGraphoCollection.injectStyles();
    ElGraphoCollection.executeFrame();
  },
  injectStyles: function() {
    let head = document.getElementsByTagName('head')[0];
    let s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) {   // IE
      s.styleSheet.cssText = styles;
    } else {                // the world
      s.appendChild(document.createTextNode(styles));
    }
    head.appendChild(s);
  },
  executeFrame: function() {
    ElGraphoCollection.graphs.forEach(function(graph) {
      let now = new Date().getTime();
      let n = 0;

      // update properties from animations
      while(n < graph.animations.length) {
        let anim = graph.animations[n];

        // if animation is running
        if (now <= anim.endTime) {
          let t = (now - anim.startTime) / (anim.endTime - anim.startTime);
          let valDiff = anim.endVal - anim.startVal;

          graph[anim.prop] = anim.startVal + EasingFunctions.easeInOutCubic(t) * valDiff;
          n++;

        }
        // if animation still exists, but we are now past the endTime, set to final end val and destroy animation
        else {
          graph[anim.prop] = anim.endVal;
          graph.animations.splice(n, 1);
          graph.hitDirty = true;
        }

        graph.dirty = true; 
      }

      if (graph.dirty) {
        graph.webgl.drawScene(graph.panX, graph.panY, graph.zoomX, graph.zoomY);
        graph.viewport.render(); // render composite
        graph.dirty = false;
      }

      if (graph.hitDirty) {
        graph.webgl.drawHit(graph.panX, graph.panY, graph.zoomX, graph.zoomY);
        graph.hitDirty = false; 
      }
    });

    requestAnimationFrame(ElGraphoCollection.executeFrame);
  }
};

module.exports = ElGraphoCollection;

if (window) {
  window.ElGraphoCollection = ElGraphoCollection;
}
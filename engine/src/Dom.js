const Dom = {
  create: function(className) {
    let el = document.createElement('div');
    el.className = 'el-grapho-' + className;
    return el;
  }
};

module.exports = Dom;
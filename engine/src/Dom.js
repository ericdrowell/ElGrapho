const Dom = {
  create: function(classNameSuffix) {
    let el = document.createElement('div');
    el.className = 'el-grapho-' + classNameSuffix;
    return el;
  }
};

module.exports = Dom;
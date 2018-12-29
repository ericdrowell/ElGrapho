const Dom = {
  create: function(classNameSuffix) {
    let el = document.createElement('div');
    el.className = 'el-grapho-' + classNameSuffix;
    return el;
  },
  closest: function(el, s) {
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1); 
    return null;
  }
};

module.exports = Dom;
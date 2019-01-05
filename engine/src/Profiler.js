let Profiler = function(funcName, func) {
  return function () {
    let start = new Date().getTime();
    let returnVal = func.apply(this, arguments);
    let end = new Date().getTime();
    let duration = end - start;

    if (Profiler.enabled) {
      console.log(funcName + '() took ' + duration + 'ms');
    }

    return returnVal;
  };
};

Profiler.enabled = false;

module.exports = Profiler;
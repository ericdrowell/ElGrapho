let Profiler = function(funcName, func) {
  return function () {
    let start = new Date().getTime();
    let returnVal = func.apply(this, arguments);
    let end = new Date().getTime();
    let duration = end - start;

    console.log(funcName + '() took ' + duration + 'ms');
    return returnVal;
  };
};

module.exports = Profiler;
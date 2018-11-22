const NumberFormatter = {
  addCommas: function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  roundToNearestDecimalPlace: function(num, places) {
    let multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
  }
};

module.exports = NumberFormatter;
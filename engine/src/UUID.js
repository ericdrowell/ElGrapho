let counter = 0;

let UUID = {
  generate: function() {
    return counter++;
  }
};

module.exports = UUID;
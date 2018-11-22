const fs = require('fs');

fs.readdir('engine/src/icons', function(err, files) {
  files.forEach(function(file) {
    let glslStr = fs.readFileSync('engine/src/icons/' + file, 'utf-8');
    let jsStr = 'module.exports = `' + glslStr + '`;';

    fs.writeFileSync('engine/dist/icons/' + file + '.js', jsStr, 'utf-8');
  });
});




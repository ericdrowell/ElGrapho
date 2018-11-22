const fs = require('fs');

fs.readdir('engine/src/shaders', function(err, files) {
  files.forEach(function(file) {
    let glslStr = fs.readFileSync('engine/src/shaders/' + file, 'utf-8');
    let jsStr = 'module.exports = `' + glslStr + '`;';

    fs.writeFileSync('engine/dist/shaders/' + file + '.js', jsStr, 'utf-8');
  });
});




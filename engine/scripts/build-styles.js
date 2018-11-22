const fs = require('fs');


let cssStr = fs.readFileSync('engine/dist/styles/ElGrapho.min.css', 'utf-8');
let jsStr = 'module.exports = `' + cssStr + '`;';

fs.writeFileSync('engine/dist/styles/ElGrapho.min.css.js', jsStr, 'utf-8');





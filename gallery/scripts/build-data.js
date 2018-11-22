const Theme = require('../../engine/src/Theme');
const Color = require('../../engine/src/Color');
const NumberFormatter = require('../../engine/src/formatters/NumberFormatter');
const Profiler = require('../../engine/src/Profiler');
const fs = require('fs');

const numMarks = 1000000;

let buildPoints = Profiler('buildPoints', function() {
  let points = [];
  for (let n=0; n<numMarks; n++) {
    let x = NumberFormatter.roundToNearestDecimalPlace(Math.random()*10 - 5, 2);
    let y = NumberFormatter.roundToNearestDecimalPlace(Math.random()*10 - 5, 2);
    points.push(y);
    points.push(x);
  }
  return points;
});

let buildColors = Profiler('buildColors', function() {
  let colors = [];
  for (let n=0; n<numMarks; n++) {
    let colorIndex = Math.floor(Math.random() * 3); // between 0 and 2
    colors.push(Theme.palette[colorIndex * 3 + 0]);
    colors.push(Theme.palette[colorIndex * 3 + 1]);
    colors.push(Theme.palette[colorIndex * 3 + 2]);
    colors.push(1);
  }
  return colors;
});

let buildHitColors = Profiler('buildHitColors', function() {
  let hitColors = [];
  for (let n=0; n<numMarks; n++) {
    let rgb = Color.intToRGB(n);
    let r = rgb[0];
    let g = rgb[1];
    let b = rgb[2];

    hitColors.push(r/255);
    hitColors.push(g/255);
    hitColors.push(b/255);
    hitColors.push(1);
  }
  return hitColors;
});

let buildSizes = Profiler('buildSizes', function() {
  let sizes = [];
  for (let n=0; n<numMarks; n++) {
    let size = NumberFormatter.roundToNearestDecimalPlace(Math.random() * 20, 2);
    sizes.push(size);
  }
  return sizes;
});

// TODO: temporary vertices generator.  Eventually will remove
let buildVertices = Profiler('buildVertices', function() {
  return {
    points: buildPoints(),
    colors: buildColors(),
    hitColors: buildHitColors(),
    sizes: buildSizes()
  };
});

vertices = buildVertices();

fs.writeFileSync('gallery/dist/data/scatter.js', 'const DATA=\'' + JSON.stringify(vertices) + '\';', 'utf-8');
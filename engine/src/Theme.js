const Color = require('./Color');

//http://there4.io/2012/05/02/google-chart-color-list/
const PALETTE_HEX = [
  '3366CC',
  'DC3912',
  'FF9900',
  '109618',
  '990099',
  '3B3EAC',
  '0099C6',
  'DD4477',
  '66AA00',
  'B82E2E',
  '316395',
  '994499',
  '22AA99',
  'AAAA11',
  '6633CC',
  'E67300',
  '8B0707',
  '329262',
  '5574A6',
  '3B3EAC'
];

let paletteRGB = [];

PALETTE_HEX.forEach(function(hex) {
  paletteRGB = paletteRGB.concat(Color.hexToRgb(hex));
});

const Theme = {
  palette: paletteRGB
};

module.exports = Theme;
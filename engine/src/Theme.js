const Color = require('./Color');

//https://www.pinterest.com/pin/567453621777194930/
// const PALETTE_HEX = [
//   '2980B9', // Belize Hold dark blue
//   'E74C3C', // Alizarin light red
//   '27AE60', // Nephritis dark green
//   'E67E22', // Carrot light orange 
//   '9B59B6', // Amethyst light purple
//   '16A085', // Green Sea dark green blue
//   'F39C12', // Orange 

//   '3498D8', // Peter River light blue
//   'C0392B', // Pomegranate dark red
//   '2ECC71', // Emerald light green
//   'D35400', // Pumpkin dark orange
//   '8E44AD', // Wisteria
//   '1ABC9C', // Turquoise light blue green
//   'F1C40F' // Sun Flower yellow
// ];

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
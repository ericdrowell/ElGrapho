module.exports = {
  entry: './engine/src/ElGrapho.js',
  output: {
    filename: 'ElGrapho.js',
    path: __dirname + '/engine/dist',
    library: 'ElGrapho',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  devtool: 'source-map',
  mode: 'development' // development or production
};
module.exports = {
  entry: './engine/src/ElGrapho.js',
  output: {
    path: __dirname + '/engine/dist',
    filename: 'ElGrapho.js',
    library: 'ElGrapho',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  devtool: 'source-map',
  mode: 'development' // development or production
};
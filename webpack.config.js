module.exports = {
  entry: './engine/src/ElGrapho.js',
  output: {
    filename: 'ElGrapho.js',
    path: __dirname + '/engine/dist',
    library: 'ElGrapho',
    libraryTarget: 'umd',
    globalObject: 'typeof window !== \'undefined\' ? window : this'
  },
  devtool: 'source-map',
  mode: 'development' // development or production
};
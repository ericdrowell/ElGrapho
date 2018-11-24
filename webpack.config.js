module.exports = {
  entry: './engine/src/ElGrapho.js',
  output: {
    filename: 'ElGrapho.js',
    path: __dirname + '/engine/dist'
  },
  devtool: 'source-map',
  mode: 'development' // development or production
};
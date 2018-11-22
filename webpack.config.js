module.exports = {
  entry: './gallery/src/gallery.js',
  output: {
    filename: 'gallery.js',
    path: __dirname + '/gallery/dist'
  },
  devtool: 'source-map',
  mode: 'development' // development or production
};
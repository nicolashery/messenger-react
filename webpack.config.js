module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
      {test: /\.js$/, loader: 'jsx-loader'},
      {test: /\.json$/, loader: 'json-loader'}
    ]
  }
};

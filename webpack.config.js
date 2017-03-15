const path = require('path');
module.exports = {
  entry: './ui/react',
  output: {
    path: path.join(__dirname, './src'),
    filename: 'bundle.js'
  },
  target: 'electron',
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'es2017', 'react']
      }
    }, {
      test: /\.json?$/,
      exclude: /node_modules/,
      loader: 'json-loader'
    }]
  }
};

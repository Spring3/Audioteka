module.exports = {
  entry: './react',
  output: {
    path: __dirname,
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

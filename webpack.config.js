var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var BUILD_DIR = path.resolve(__dirname, 'public');
var APP_DIR = path.resolve(__dirname, 'src');

module.exports = {
  entry: APP_DIR + "/index.jsx",
  output: {
    path: BUILD_DIR,
    filename: "bundle.js"
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "./public/*", to: "./dist" }
      ])
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel-loader'
      }
    ]
  }
}
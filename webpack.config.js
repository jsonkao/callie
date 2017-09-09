var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
module.exports = {
  context: path.join(__dirname, 'quickstart'),
  entry: "./src/index.js",
  output: {
    filename: "./dist/bundle.js"
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "./public/*", to: "./dist" }
      ])
  ]
}
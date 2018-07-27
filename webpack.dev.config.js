const defaultConfig = require('./webpack.config');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
  ...defaultConfig,
  mode: "development",
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    ...(defaultConfig.plugins || []),
    new NodemonPlugin()
  ],
};

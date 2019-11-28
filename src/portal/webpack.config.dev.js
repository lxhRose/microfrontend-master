const config = require('./webpack.config.js');
const webpack = require('webpack');

const PORT = 9000;

config.mode = 'development';
config.devtool = 'cheap-module-source-map';
config.output.publicPath = 'http://localhost:' + PORT + '/';
config.plugins.push(new webpack.NamedModulesPlugin());
config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.devServer = {
  port: PORT,
  contentBase: '../../release',
  historyApiFallback: true,
  watchOptions: { aggregateTimeout: 300, poll: 1000 },
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  // proxy: {
  //   "/common/": {
  //     target: "http://localhost:" + PORT,
  //     pathRewrite: { "^/common": "" }
  //   }
  // }
}

module.exports = config;

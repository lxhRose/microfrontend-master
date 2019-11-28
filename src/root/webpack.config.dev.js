const config = require('./webpack.config.js');
const webpack = require('webpack');

const PORT = 9001;
const APP_NAME = 'root';

config.mode = 'development';
config.devtool = 'cheap-module-source-map';
config.output.publicPath = 'http://localhost:' + PORT + '/';
config.plugins.push(new webpack.NamedModulesPlugin());
config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.devServer = {
  port: PORT,
  host: '0.0.0.0',
  contentBase: '../../release/' + APP_NAME,
  inline: true,
  historyApiFallback: true,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
  // proxy: {
  //   "/common/": {
  //     target: "http://localhost:" + PORT,
  //     pathRewrite: { "^/common": "" }
  //   }
  // }
}

module.exports = config;

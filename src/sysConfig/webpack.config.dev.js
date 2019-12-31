const config = require('./webpack.config.js');
const webpack = require('webpack');

const PORT = 9004;
const APP_NAME = 'sysConfig';

config.mode = 'development';
config.devtool = 'cheap-module-source-map';
config.output.publicPath = 'http://localhost:' + PORT + '/';
config.plugins.push(new webpack.NamedModulesPlugin());
config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.devServer = {
  port: PORT,
  host: '0.0.0.0',
  contentBase: '../../build/' + APP_NAME,
  inline: true,
  historyApiFallback: true,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  proxy: {
    "/api/*": {
      target: "http://192.168.41.216:7000",
      changeOrigin: true
    },
  }
}

module.exports = config;

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
  contentBase: '../../build',
  historyApiFallback: true,
  watchOptions: { aggregateTimeout: 300, poll: 1000 },
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  proxy: [
    creatProxy('batch'),
    creatProxy('inpNurse'),
    creatProxy('sysConfig')
  ]
}

function creatProxy(name) {
  return {
    context: `/${name}/api`,
    pathRewrite: {
      [`^/${name}/api`]: "/topro"
    },
    target: "http://120.27.0.230:8088",
    secure: false,
    changeOrigin: true,
    logLevel: "debug"
  }
}

module.exports = config;

const config = require('./webpack.config.dev.js');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PORT = 8001;
const APP_NAME = 'base';

config.mode = 'development';
config.devtool = 'cheap-module-source-map';
config.entry = {
  index: './src/index.ts'
};
config.output = {
  filename: '[name].js',
  publicPath: 'http://localhost:' + PORT + '/'
};
config.plugins.push(new webpack.NamedModulesPlugin());
config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.plugins.push(
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './src/index.html'),
    favicon: path.resolve(__dirname, './src/favicon.ico')
  }),
);
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
    [`/${APP_NAME}/api/*`]: {
      target: "http://120.27.0.230:8088",
      secure: false,
      pathRewrite: {
        [`^/${APP_NAME}/api`]: "/topro"
      },
      changeOrigin: true,
      logLevel: "debug"
    },
  }
}

module.exports = config;

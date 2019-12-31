const config = require('./webpack.config.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

config.mode = 'production';
config.devtool = 'source-map';
config.plugins.push(new CleanWebpackPlugin());
config.plugins.push(
  new CompressionWebpackPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: new RegExp('\\.(js|css)$'),
    threshold: 10240,
    minRatio: 0.8
  })
);

module.exports = config;

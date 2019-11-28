const config = require('./webpack.config.dev.js');
const webpack = require('webpack');
const path = require('path');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PORT = 8003;
const APP_NAME = 'inpNurse';

config.mode = 'development';
config.devtool = 'cheap-module-source-map';
config.entry = {
  index: './src/index.ts'
};
config.output = {
  filename: '[name].js'
};
config.plugins.push(new webpack.NamedModulesPlugin());
config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.plugins.push(
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './src/index.ejs'),
    templateParameters: {
      title: 'test'
    }
  }),
);
// 该插件将把给定的 JS 或 CSS 文件添加到 webpack 配置的文件中，并将其放入资源列表 html webpack插件注入到生成的 html 中。
config.plugins.push(
  new AddAssetHtmlPlugin([
    {
      // 要添加到编译中的文件的绝对路径，以及生成的HTML文件。支持 globby 字符串
      filepath: require.resolve('../../dll/vendor.dll.js')
    }
  ]),
);
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

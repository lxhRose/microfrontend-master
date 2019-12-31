const path = require('path');
const webpack = require('webpack');
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const package = require("./../../package.json");
const VERSION = package.version;
const node_modules = '../../node_modules/';
// "use-default.min": node_modules + 'systemjs/dist/extras/use-default.min.js',

module.exports = {
  devtool: 'none',
  entry: () => new Promise((resolve) => resolve([
    `${node_modules}systemjs/dist/system.min.js`,
    `${node_modules}systemjs/dist/extras/amd.min.js`,
    `${node_modules}systemjs/dist/extras/named-exports.min.js`,
    `${node_modules}core-js-bundle/minified.js`,
    `${node_modules}zone.js/dist/zone.min.js`,
    './src/portal.js'
  ])),
  output: {
    publicPath: '/',
    filename: `index.v${VERSION}.js`,
    path: path.resolve(__dirname, '../../build')
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      { parser: { system: false } },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  resolve: {
    modules: [__dirname, 'node_modules']
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(VERSION)
    }),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('../../dll/vendor-manifest.json')
    // }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      favicon: path.resolve(__dirname, './src/favicon.ico'),
      production: true
    }),
    // 该插件将把给定的 JS 或 CSS 文件添加到 webpack 配置的文件中，并将其放入资源列表 html webpack插件注入到生成的 html 中。
    // new AddAssetHtmlPlugin([
    //   {
    //     // 要添加到编译中的文件的绝对路径，以及生成的HTML文件。支持 globby 字符串
    //     filepath: require.resolve('../../dll/vendor.dll.js')
    //   }
    // ]),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
  ],
  externals: []
};

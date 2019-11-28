const path = require('path');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const systemjsBasePath = '../../node_modules/';

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    system: systemjsBasePath + 'systemjs/dist/system.min.js',
    amd: systemjsBasePath + 'systemjs/dist/extras/amd.min.js',
    named_exports: systemjsBasePath + 'systemjs/dist/extras/named-exports.min.js',
    use_default: systemjsBasePath + 'systemjs/dist/extras/use-default.min.js',
    minified: systemjsBasePath + 'core-js-bundle/minified.js',
    zone: systemjsBasePath + 'zone.js/dist/zone.min.js',
    portal: './src/portal.js'
  },
  output: {
    publicPath: '',
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash:8].js',
    path: path.resolve(__dirname, '../../release')
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
    new CleanWebpackPlugin(),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true
            }
          }
        ]
      },
      canPrint: true
    }),
    new webpack.DefinePlugin({
      __DEV__: true,
      STATIC_URL: JSON.stringify(
        'https://e-static.oss-cn-shanghai.aliyuncs.com'
      ),
      _URL_: JSON.stringify('http://api.qiyizhuan.com.cn/backend'), //api.mizhuanba.com
      TOKEN_KEY: JSON.stringify('token_key')
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../../dll/vendor-manifest.json')
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.ejs'),
    }),
    // 该插件将把给定的 JS 或 CSS 文件添加到 webpack 配置的文件中，并将其放入资源列表 html webpack插件注入到生成的 html 中。
    new AddAssetHtmlPlugin([
      {
        // 要添加到编译中的文件的绝对路径，以及生成的HTML文件。支持 globby 字符串
        filepath: require.resolve('../../dll/vendor.dll.js')
      }
    ]),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
  ],
  externals: []
};

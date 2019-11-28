const webpack = require('webpack');
const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';
const APP_NAME = 'inpNurse';

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    main: './src/main.js',
  },

  output: {
    filename: '[name].js',
    publicPath: APP_NAME + '/',
    path: path.resolve(__dirname, '../../release/' + APP_NAME),
    libraryTarget: 'umd',
    library: APP_NAME
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.less', '.json']
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader?sourceMap=true',
            options: {
              javascriptEnabled: true
            }
          }
        ],
        include: path.resolve(__dirname, './node_modules/antd')
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ],
        exclude: /node_modules/
      },
      // 解析图片资源
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      // 解析 字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
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
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
  ]
};

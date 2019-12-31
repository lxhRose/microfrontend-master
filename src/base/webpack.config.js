const webpack = require('webpack');
const path = require('path');

const APP_NAME = 'base';

module.exports = {
  entry: {
    main: './src/main.js',
  },

  output: {
    filename: `[name].js`,
    publicPath: `/${APP_NAME}/`,
    path: path.resolve(__dirname, '../../build/' + APP_NAME),
    libraryTarget: 'umd',
    library: APP_NAME
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.less', '.json']
  },
  performance: {
    hints: false
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
        include: [
          path.resolve(__dirname, '../../node_modules/antd'),
          path.resolve(__dirname, './node_modules/antd')
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader
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
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/images/'
          }
        }
      },
      // 解析 字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/font/'
          }
        }
      }
    ]
  },
  plugins: [
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('../../dll/vendor-manifest.json')
    // }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
  ]
};

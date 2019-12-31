const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = (angularWebpackConfig, options) => {
  let singleSpaWebpackConfig = singleSpaAngularWebpack(angularWebpackConfig, options)
  if (angularWebpackConfig.mode === 'production') {
    singleSpaWebpackConfig.plugins.push(
      new CompressionWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(js|css)$'),
        threshold: 10240,
        minRatio: 0.8
      })
    )
  }
  return singleSpaWebpackConfig
  // return angularWebpackConfig
}
const path = require('path');
const webpack = require('webpack');
const OfflinePlugin = require('offline-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: [require('babel-plugin-transform-es2015-classes')]
          }
        }
      }
    ]
  },
  devtool: 'eval',
  devServer: {
    contentBase: './dist'
  },
  plugins: [
      new webpack.optimize.UglifyJsPlugin(),
      new OfflinePlugin({
          ServiceWorker: {
              minify: true
          },
          AppCache: false,
          updateStrategy: 'all',
          audoUpdate: true
      })
  ]
};

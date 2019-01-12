const path = require("path");
const OfflinePlugin = require("offline-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "js/bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  devtool: "eval",
  mode: "production",
  devServer: {
    contentBase: "./dist"
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },
  plugins: [
    new OfflinePlugin({
      ServiceWorker: {
        minify: true
      },
      AppCache: false,
      updateStrategy: "all",
      audoUpdate: true
    })
  ]
};

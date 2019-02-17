const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/ts/index.ts"
  },
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    path: __dirname + "/dist"
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      { test: /\.(woff|woff2|eot|ttf)$/, loader: "url-loader?limit=100000" },
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },
  plugins: [
    new CleanWebpackPlugin("dist"),
    new CopyWebpackPlugin([
      {
        from: "./static/**/*.*",
        transformPath(targetPath) {
          return targetPath.replace("static/", "");
        }
      }
    ]),
    new HtmlWebpackPlugin({
      template: "src/html/index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ]
};

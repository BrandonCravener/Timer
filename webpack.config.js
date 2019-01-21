const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/ts/index.ts",
  output: {
    filename: "index.js",
    path: __dirname + "/dist"
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"]
  },
  devtool: "inline-source-map",
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
    })
  ]
};

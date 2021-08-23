const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "source-map",
  mode: "development",
  entry: "./src/index.ts",
  experiments: {
    outputModule: true,
  },
  output: {
    filename: "lcnc.sdk.js",
    path: path.resolve(__dirname, "dist"),
    
    library: {
      // do not specify a `name` here
      type: 'module',
    },
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3000,
    open: true
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts?/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      _BUILD: true
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      inject: "body"
    })
  ]
};

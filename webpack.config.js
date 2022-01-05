const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

let config = {
  devtool: "source-map",
  mode: "development",
  entry: "./src/index.ts",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3000,
    open: true
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts?/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
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
    }),
  ]
};

let moduleLib = Object.assign({}, config, {
	experiments: {
		outputModule: true
	},
	output: {
		filename: "kflowcode.sdk.module.js",
		path: path.resolve(__dirname, "dist"),

		library: {
			type: "module"
		}
	}
});
let commonLib = Object.assign({}, config, {
	output: {
		filename: "kflowcode.sdk.js",
		path: path.resolve(__dirname, "dist")
	}
});
module.exports = [moduleLib, commonLib];
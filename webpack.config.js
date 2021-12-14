const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  devtool: "source-map",
  target: "web",
  entry: {
    main: [
      './src/js/main.js',
      './src/scss/main.scss',
    ],
    // vendor: ['babel-polyfill'],
  },
  resolve: {
    extensions: ['.js', '.scss']
  },
  output: {
    path: path.resolve(__dirname, './'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: {
          loader: "svg-url-loader",
        },
      },
      {
        test: /\.png$/,
        use: {
          loader: "file-loader",
          options: {
            esModule: false,
          }
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              implementation: require("sass"),
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sourceMap: true,
            },
          },
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
      chunkFilename: "[id].css"
    })
  ]
};

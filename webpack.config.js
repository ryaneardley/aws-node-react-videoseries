'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const title = 'Tracr';

let entry = [
  path.join(__dirname, 'client', 'app.js'),
];

let plugins = [
];

let production = {};
let dev = {};
let htmlProd = {};
let htmlDev = {};

if (process.env.MODE === 'production') {

} else {
  dev = {
    devtool: '#source-map',
  };
  plugins = [
    new webpack.HotModuleReplacementPlugin(),
    ...plugins,
  ];
  entry = [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    ...entry,
  ];
}

const htmlTemplate = new HtmlWebpackPlugin(Object.assign({
  title,
  appMountId: 'app',
  mobile: true,
  inject: false,
  minify: {
    collapseWhitespace: true,
    preserveLineBreaks: true,
  },
  template: require('html-webpack-template'),
}, htmlProd, htmlDev));

const favIcon = new FaviconsWebpackPlugin({
  logo: path.join(__dirname, 'assets', 'Logo.png'),
  title,
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: true,
    coast: true,
    favicons: true,
    firefox: true,
    opengraph: true,
    twitter: true,
    yandex: true,
    windows: true,
  },
});

plugins = [
  htmlTemplate,
  favIcon,
  new webpack.DefinePlugin({
    TITLE: JSON.stringify(title),
  }),
  ...plugins,
]

module.exports = Object.assign({}, {
  entry,
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: "assets/[hash].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins,
}, production, dev);

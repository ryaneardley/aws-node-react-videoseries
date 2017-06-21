var path = require('path');
var express = require('express');
var webpack = require('webpack');
var webpackConfig = require('../webpack.config');
var WebpackDevServer = require('webpack-dev-server');
var historyApiFallback = require('connect-history-api-fallback');

var app;

if (process.env.MODE == 'production') {
  app = express();
  app.use(historyApiFallback());
} else {
  app = new WebpackDevServer(webpack(webpackConfig), {
    contentBase: '/build/',
    stats: {
      colors: true,
    },
    hot: true,
    historyApiFallback: true
  });
}

app.use('/', express.static(path.join(__dirname, '../build')));
app.listen(process.env.PORT || 8080);

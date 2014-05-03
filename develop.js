var http = require('http');

var connect = require('connect');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');
var sendStatic = require('send');

var webpackConfig = require('./webpack.config.js');
var webpackCompiler = webpack(webpackConfig);

var app = connect();

app.use(webpackDevMiddleware(webpackCompiler, {
  publicPath: '/build/',
  stats: {
    colors: true
  }
}));

app.use('/', function(req, res, next) {
  if (!(req.url === '/' || req.url.match(/^\/\?/))) {
    return next();
  }

  sendStatic(req, 'index.html').pipe(res);
});

app.use(function(req, res, next) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('Not found');
});

app.use(connect.errorHandler());

var port = process.env.PORT || 3000;
http.createServer(app).listen(port);
console.log('Development server started on port', port);

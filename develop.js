var http = require('http');

var connect = require('connect');
var webdev = require('webdev');
var _ = require('lodash');
var reactify = require('reactify');
var serveStatic = require('serve-static');
var sendStatic = require('send');

var browserify = require('./webdev/browserify');
var less = require('./webdev/less');
var template = require('./webdev/template');

var app = connect();

var files = require('./files');
var vendors = _.map(files.js.vendor, function(vendor) {
  return vendor.dir + '/' + vendor.dist;
});

var webdevMiddleware = webdev.connect.middleware;
var log = webdev.util.log;

var tmpDir = '.tmp';
var cache = webdev.cache.create({_meta: {tmpDir: tmpDir}});
log('Using cache dir', '\''+webdev.util.colors.cyan(tmpDir)+'\'');

app.use('/app.js', webdev.connect.middleware({
  contentType: 'text/javascript',
  cache: cache,
  src: ['app/**/*.js'],
  build: function(cb) {
    return browserify('app/app.js', {
      transforms: [reactify]
    }, cb);
  }
}));

app.use('/style.css', webdevMiddleware({
  contentType: 'text/css',
  cache: cache,
  src: ['app/**/*.less'],
  build: function(cb) {
    return less('app/style.less', cb);
  }
}));

app.use('/start.js', function(req, res, next) {
  sendStatic(req, 'app/start.js').pipe(res);
});
app.use('/bower_components', serveStatic(__dirname + '/bower_components'));
app.use('/fonts', serveStatic(__dirname + '/app/core/fonts'));

app.use('/', function(req, res, next) {
  if (!(req.url === '/' || req.url.match(/^\/\?/))) {
    return next();
  }

  var handler = webdevMiddleware({
    contentType: 'text/html',
    cache: cache,
    key: 'index.html',
    src: ['app/index.html'],
    build: function(cb) {
      return template('app/index.html', {
        production: false,
        vendors: vendors,
      }, cb);
    }
  });

  handler(req, res, next);
});

app.use(function(req, res, next) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('Not found');
});

app.use(connect.errorHandler());

var port = process.env.PORT || 3000;
startServer(app, port);

function startServer(app, port) {
  port = port || 3000;
  http.createServer(app).listen(port);
  log('Development server started on port', webdev.util.colors.magenta(port));
}

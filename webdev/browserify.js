var _ = require('lodash');
var browserify = require('browserify');

function browserifyBundle(entry, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  options = _.defaults(options, {
    basedir: process.cwd(),
    debug: true,
    transforms: [],
    ignores: []
  });

  if (entry.substr(0, 1) !== '/' && entry.substr(0, 2) !== './') {
    entry = './' + entry;
  }

  var bundler = browserify(entry, {basedir: options.basedir});
  _.forEach(options.transforms, bundler.transform.bind(bundler));
  _.forEach(options.ignores, bundler.ignore.bind(bundler));
  var stream = bundler.bundle({debug: options.debug});

  stringFromStream(stream, function(err, str) {
    if (err) {
      return cb(err);
    }

    cb(null, str);
  });
}

function stringFromStream(stream, cb) {
  var str = [];

  stream.on('data', function(chunk) {
    str.push(chunk.toString());
  });

  stream.on('error', function(err) {
    cb(err);
  });

  stream.on('end', function() {
    cb(null, str.join(''));
  });
}

module.exports = browserifyBundle;

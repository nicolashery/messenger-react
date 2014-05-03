var fs = require('fs');

var _ = require('lodash');
var less = require('less');

function cssFromLess(path, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  options = _.defaults(options, {
    compress: false,
    paths: []
  });
  options.filename = path;

  fs.readFile(path, 'utf8', function(err, str) {
    if (err) {
      return cb(err);
    }

    less.render(str, options, cb);
  });
}

module.exports = cssFromLess;

var fs = require('fs');

var _ = require('lodash');

function template(path, data, cb) {
  fs.readFile(path, 'utf8', function(err, str) {
    if (err) {
      return cb(err);
    }

    str = _.template(str, data);

    return cb(null, str);
  });
}

module.exports = template;

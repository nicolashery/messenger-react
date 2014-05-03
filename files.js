// Some files used by different tasks (development, build, test)
// Add/remove files in one place (here) to avoid repetition
var files = {
  js: {
    // Provide path to vendor directory ("dir"),
    // then relative path to unminified vendor bundle ("dist")
    // and if it exists minified version ("distMin")
    vendor: [
      {dir: 'bower_components/react', dist: 'react.js', distMin: 'react.min.js'},
      {dir: 'bower_components/lodash', dist: 'dist/lodash.js', distMin: 'dist/lodash.min.js'},
      {dir: 'bower_components/fastclick', dist: 'lib/fastclick.js'}
    ]
  }
};

module.exports = files;

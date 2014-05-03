var _ = require('lodash');
var browserify = require('browserify');
var reactify = require('reactify');
var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var template = require('gulp-template');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var clean = require('gulp-clean');
var es = require('event-stream');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var runSequence = require('run-sequence');

var pkg = require('./package.json');
var files = require('./files');

function makeVendorPath(build, vendor) {
  return vendor.dir + '/' + vendor[build];
}

gulp.task('scripts-vendor', function() {
  var vendors = _.map(files.js.vendor, function(vendor) {
    return vendor.dir + '/' + vendor.dist;
  });

  return gulp.src(vendors)
    .pipe(uglify())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/tmp'));
});

gulp.task('scripts-app', function() {
  var b = browserify('./app/app.js');
  b.transform(reactify);

  return b.bundle()
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('dist/tmp'));
});

gulp.task('scripts-start', function() {
  return gulp.src('app/start.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/tmp'));
});

gulp.task('scripts', ['scripts-vendor', 'scripts-app', 'scripts-start'], function() {
  return gulp.src(['dist/tmp/vendor.js', 'dist/tmp/app.js', 'dist/tmp/start.js'])
    .pipe(concat('all-' + pkg.version + '.js'))
    .pipe(gulp.dest('dist'));
});

// gulp.task('scripts', function() {
//   var vendors = _.map(files.js.vendor, function(vendor) {
//     return vendor.dir + '/' + vendor.dist;
//   });
//   var vendorStream = gulp.src(vendors);
//
//   var b = browserify('./app/app.js');
//   b.transform(reactify);
//   var appStream = b.bundle()
//     .on('error', function (err) {
//       console.log(err.toString());
//       this.emit('end');
//     })
//     .pipe(source('app.js'))
//     .pipe(streamify(concat('app.js')));
//
//   var startStream = gulp.src('app/start.js');
//
//   return es.concat.apply(es, [vendorStream, appStream, startStream])
//     // .pipe(uglify())
//     .pipe(concat('all-' + pkg.version + '.js'))
//     .pipe(gulp.dest('dist'));
// });

gulp.task('styles', function() {
  return gulp.src('app/style.less')
    .pipe(less())
    .pipe(concat('all-' + pkg.version + '.css'))
    .pipe(cssmin({keepSpecialComments: 0}))
    .pipe(gulp.dest('dist'));
});

gulp.task('index', function() {
  return gulp.src('app/index.html')
    .pipe(template({
      production: true,
      pkg: pkg
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

gulp.task('clean-tmp', function() {
  return gulp.src('dist/tmp', {read: false})
    .pipe(clean());
});

gulp.task('build', function(cb) {
  runSequence(
    'clean',
    ['scripts', 'styles', 'index'],
    'clean-tmp',
  cb);
});

gulp.task('default', ['build']);

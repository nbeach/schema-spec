var gulp = require('gulp');

var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var addsrc = require('gulp-add-src');
var sourcemaps = require('gulp-sourcemaps');
var gulpJsdoc2md = require('gulp-jsdoc-to-markdown');

var DESTINATION_DIR = 'dist/';
var OUTPUT_FILENAME = 'schema-spec.js';
var MINIFIED_FILENAME = OUTPUT_FILENAME.replace('.js', '.min.js');

gulp.task('build', function() {
  return gulp
    .src(['src/*.js'])
    .pipe(concat(OUTPUT_FILENAME))
    .pipe(sourcemaps.init())
    .pipe(gulp.dest(DESTINATION_DIR))
    .pipe(rename(MINIFIED_FILENAME))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DESTINATION_DIR));
});

gulp.task('document', ['build'], function () {
  return gulp
    .src([DESTINATION_DIR + OUTPUT_FILENAME])
    .pipe(gulpJsdoc2md())
    .pipe(addsrc.prepend('project-info.md'))
    .pipe(concat('README.md'))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*', ['build', 'document']);
  gulp.watch('project-info.md', ['document']);
});

// Default Task
gulp.task('default', ['build', 'document']);
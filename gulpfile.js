'use strict'

var gulp = require('gulp')
var  scss = require('gulp-sass')
var  sourcemaps = require('gulp-sourcemaps')
var  babel = require('gulp-babel')
var  concat = require('gulp-concat')
var  plumber = require('gulp-plumber')
var  imagemin = require('gulp-imagemin')
var del = require('del')

var SASS_INCLUDE_PATHS = [
  './node_modules/bootstrap-scss/'
]

var LIBRARIES_PATHS = [
  './node_modules/jquery/dist/jquery.min.js',
  './node_modules/bootstrap/dist/js/bootstrap.js'
]

function handleError (err) {
  console.log(err.toString())
  this.emit('end')
}

function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del([ './assets' ]);
}

function styles() {
  return gulp.src('./src/sass/main.scss')
    .pipe(plumber({errorHandler: handleError}))
    .pipe(sourcemaps.init())
    .pipe(scss({outputStyle: 'compressed', includePaths: SASS_INCLUDE_PATHS}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./assets/css'))
}

function scripts() {
  return gulp.src('./src/js/**/*.js')
    .pipe(plumber({errorHandler: handleError}))
    .pipe(sourcemaps.init())
    .pipe(babel({compact: true}))
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./assets/js'))
}

function scriptsLibraries() {
  return gulp.src(LIBRARIES_PATHS)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(sourcemaps.init())
    .pipe(concat('libs.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./assets/js'))
}

function images() {
  return gulp.src('./src/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./assets/img'))
}

function fonts() {
  return gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./assets/fonts'))
}

function watch() {
  gulp.watch('./src/sass/**/*.scss', styles)
  gulp.watch('./src/js/**/*.js', scripts)
}

var build = gulp.series(clean, gulp.parallel(scriptsLibraries, styles, scripts, images, fonts));

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.scriptsLibraries = scriptsLibraries;
exports.images = images;
exports.fonts = fonts;
exports.watch = watch;
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;
'use strict';

//////////////////////////////
// Requires
//////////////////////////////
var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    babelify = require('babelify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    importOnce = require('node-sass-import-once'),
    autoprefixer = require('gulp-autoprefixer'),
    scsslint = require('gulp-scss-lint'),
    imagemin = require('gulp-imagemin'),
    gulpif = require('gulp-if'),
    browserSync = require('browser-sync'),
    selenium = require('selenium-standalone'),
    webdriver = require('gulp-webdriver');

//////////////////////////////
// Variables
//////////////////////////////
var dirs = {
    'js': {
        'watch': [
            'src/js/*.js',
        ],
        'browserify': [
            'src/js/app.js'
        ]
    },
    'server': {
        'main': 'index.js',
        'watch': [
            'index.js',
            'api/**/*.js',
            'util/**/*.js'
        ]
    },
    'sass': 'src/sass/**/*.scss',
    'images': 'src/images/**/*.*',
    'html': 'src/html/**/*.*',
    'public': 'public/'
};

//need create a CI Process later
var isCI = false;

var onError = function (err) {
    gutil.beep();
    console.log(err);
};

//////////////////////////////
// Update BrowserSync
//////////////////////////////
browserSync = browserSync.create();

//////////////////////////////
// browserify Tasks
//////////////////////////////
gulp.task('browserify', function () {
    gulp.src(dirs.js.browserify)
        .pipe(browserify({
            transform: [babelify]
        }))
        .pipe(gulpif(!isCI, sourcemaps.init()))
        .pipe(uglify({
            'mangle': isCI ? true : false
        }))
        .pipe(gulpif(!isCI, sourcemaps.write('maps')))
        .pipe(gulp.dest(dirs.public + 'js'))
        .pipe(browserSync.stream());
});

gulp.task('browserify:watch', function () {
    gulp.watch(dirs.js.watch, ['browserify']);
});

//////////////////////////////
// Sass Tasks
//////////////////////////////
gulp.task('sass', function () {
    gulp.src(dirs.sass)
        .pipe(scsslint())
        //.pipe(plumber({
        //  errorHandler: onError
        //}))
        .pipe(gulpif(!isCI, sourcemaps.init()))
        .pipe(sass({
            'outputStyle': isCI ? 'compressed' : 'expanded',
            'importer': importOnce,
            'importOnce': {
                'index': true,
                'css': true,
                'bower': false
            }
        }))
        .pipe(autoprefixer())
        .pipe(gulpif(!isCI, sourcemaps.write('maps')))
        .pipe(gulp.dest(dirs.public + 'css'))
        .pipe(browserSync.stream());
});

gulp.task('sass:watch', function () {
    gulp.watch(dirs.sass, ['sass']);
});

//////////////////////////////
// Image Tasks
//////////////////////////////
gulp.task('images', function () {
    gulp.src(dirs.images)
        .pipe(imagemin({
            'progressive': true,
            'svgoPlugins': [
                { 'removeViewBox': false }
            ]
        }))
        .pipe(gulp.dest(dirs.public + '/images'));
});

gulp.task('images:watch', function () {
    gulp.watch(dirs.images, ['images']);
});

//////////////////////////////
// Html Tasks
//////////////////////////////
gulp.task('html', function () {
    gulp.src(dirs.html)
        .pipe(gulp.dest(dirs.public));
});

gulp.task('html:watch', function () {
    gulp.watch(dirs.html, ['html']);
});


//////////////////////////////
// Nodemon Task
//////////////////////////////
gulp.task('nodemon', function (cb) {
    nodemon({
        'script': dirs.server.main,
        'watch': dirs.server.watch,
        'env': {
            'NODE_ENV': 'development'
        }
    })
        .once('start', function () {
            cb();
        })
        .on('restart', function () {
            console.log('Restarted');
        });
});

//////////////////////////////
// Browser Sync Task
//////////////////////////////
gulp.task('browser-sync', ['nodemon'], function (cb) {
    browserSync.init({
        'proxy': "localhost:17376"
    }, cb);
});


//////////////////////////////
// Selenium Task
//////////////////////////////
gulp.task('selenium', function (cb) {
    selenium.install({ logger: console.log }, function () {
        selenium.start(cb);
    });
});

//////////////////////////////
// wdio test Task
//////////////////////////////
gulp.task('wdio', ['selenium'], function () {
    return gulp.src('wdio.conf.js')
        .pipe(webdriver());
});

//////////////////////////////
// Running Tasks
//////////////////////////////
gulp.task('build', ['browserify', 'sass', 'images', 'html']);

gulp.task('e2e', ['build', 'nodemon', 'wdio']);

gulp.task('watch', ['browserify:watch', 'sass:watch', 'images:watch', 'html:watch']);

gulp.task('default', ['build', 'browser-sync', 'watch']);

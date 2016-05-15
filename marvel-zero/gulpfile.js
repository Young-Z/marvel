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
    sass = require('gulp-sass'),
    importOnce = require('node-sass-import-once'),
    autoprefixer = require('gulp-autoprefixer'),
    scsslint = require('gulp-scss-lint'),
    imagemin = require('gulp-imagemin'),
    gulpif = require('gulp-if'),
    browserSync = require('browser-sync');

//////////////////////////////
// Variables
//////////////////////////////
var dirs = {
    'js': {
        'lint': [
            'index.js',
            'src/**/*.js',
            '!src/**/*.min.js'
        ],
        'uglify': [
            'src/js/**/*.js',
            '!src/js/**/*.min.js'
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
// JavaScript Lint Tasks
//////////////////////////////
gulp.task('eslint', function () {
    gulp.src(dirs.js.lint)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(gulpif(isCI, eslint.failOnError()));
});

gulp.task('uglify', function () {
    gulp.src(dirs.js.uglify)
        .pipe(gulpif(!isCI, sourcemaps.init()))
        .pipe(uglify({
            'mangle': isCI ? true : false
        }))
        .pipe(gulpif(!isCI, sourcemaps.write('maps')))
        .pipe(gulp.dest(dirs.public + 'js'))
        .pipe(browserSync.stream());
});

gulp.task('eslint:watch', function () {
    gulp.watch(dirs.js.lint, ['eslint']);
});

gulp.task('uglify:watch', function () {
    gulp.watch(dirs.js.uglify, ['uglify']);
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
            'outputStyle': isCI ? 'compressed': 'expanded',
            'importer': importOnce,
            'importOnce': {
                'index': true,
                'css': true,
                'bower': true
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
            // console.log('Restarted');
        });
});

//////////////////////////////
// Browser Sync Task
//////////////////////////////
gulp.task('browser-sync', ['nodemon'], function () {

    browserSync.init({
        'proxy': "localhost:7376"
    });
});

//////////////////////////////
// Running Tasks
//////////////////////////////
gulp.task('build', ['uglify', 'sass', 'images', 'html']);

gulp.task('test', ['build']);

gulp.task('watch', ['eslint:watch', 'uglify:watch', 'sass:watch', 'images:watch', 'html:watch']);

gulp.task('default', ['browser-sync', 'build', 'watch']);

/* jshint node:true */
'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var argv = require('yargs').argv;
var $ = require('gulp-load-plugins')();
var bower = require('main-bower-files')();

gulp.task('styles', function() {
  return gulp.src([
      'client/app/styles/less/app-green.less',
      'client/app/styles/less/app-blue.less',
      'client/app/styles/less/app-red.less',
      'client/app/styles/less/app-orange.less'
    ])
    .pipe($.plumber())
    .pipe($.less())
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe(gulp.dest('client/dist/styles'))
    .pipe(gulp.dest('client/app/styles'))
    .pipe(gulp.dest('client/.tmp/styles'));
});


gulp.task('jshint', function() {
  return gulp.src('client/app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  return gulp.src('client/app/scripts/**/*.js')
    .pipe($.jscs());
});

gulp.task('html', ['styles'], function() {
  var lazypipe = require('lazypipe');
  var cssChannel = lazypipe()
    .pipe($.csso)
    .pipe($.replace, 'client/lib/bootstrap/fonts', 'fonts');

  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src(['client/app/**/*.html'])
    .pipe(assets)
    .pipe($.if('*.js', $.ngAnnotate()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', cssChannel()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('client/dist'));
});



gulp.task('images', function() {
  return gulp.src('client/app/images/**/*')
     .pipe($.cache($.imagemin({
       progressive: true,
       interlaced: true
     })))
    .pipe(gulp.dest('client/dist/images'));
});

gulp.task('fonts', function() {
  return gulp.src(bower.concat('client/app/styles/fonts/**/*')
    .concat('client/lib/bootstrap/fonts/*')
  )
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('client/dist/fonts'))
    .pipe(gulp.dest('client/app/fonts'))
    .pipe(gulp.dest('client/.tmp/fonts'))
});

gulp.task('extras', function() {
  return gulp.src([
    'client/app/*.*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist', 'client/dist']));
gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/public/test/karma.conf.js',
    singleRun: true
  }, done);
});

// inject bower components
gulp.task('wiredep', function() {
  var wiredep = require('wiredep').stream;
  var exclude = [
    'bootstrap',
    'jquery',
    'es5-shim',
    'json3',
    'angular-scenario'
  ];

  gulp.src('client/app/styles/*.less')
    .pipe(wiredep())
    .pipe(gulp.dest('client/app/styles'));

  gulp.src('client/app/*.html')
    .pipe(wiredep({exclude: exclude}))
    .pipe(gulp.dest('app'));

  gulp.src('client/test/*.js')
    .pipe(wiredep({exclude: exclude, devDependencies: true}))
    .pipe(gulp.dest('client/test'));
});



gulp.task('builddist', ['jshint', 'html', 'images', 'fonts', 'extras', 'styles'],
  function() {
  return gulp.src('client/dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('build', ['clean'], function() {
  gulp.start('builddist');
});


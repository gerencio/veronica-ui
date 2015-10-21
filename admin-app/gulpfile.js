/* jshint node:true */
'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var argv = require('yargs').argv;
var $ = require('gulp-load-plugins')();
var bower = require('main-bower-files')();

gulp.task('styles', function() {
  return gulp.src([
      'public/app/styles/less/app-green.less',
      'public/app/styles/less/app-blue.less',
      'public/app/styles/less/app-red.less',
      'public/app/styles/less/app-orange.less'
    ])
    .pipe($.plumber())
    .pipe($.less())
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe(gulp.dest('public/dist/styles'))
    .pipe(gulp.dest('public/app/styles'))
    .pipe(gulp.dest('public/.tmp/styles'));
});



gulp.task('jshint', function() {
  return gulp.src('public/app/scripts/**/*.js')
    .pipe($.jshint());
    //.pipe($.jshint.reporter('jshint-stylish'))
    //.pipe($.jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  return gulp.src('public/app/scripts/**/*.js')
    .pipe($.jscs());
});

gulp.task('html', ['styles'], function() {
  var lazypipe = require('lazypipe');
  var cssChannel = lazypipe()
    .pipe($.csso)
    .pipe($.replace, 'public/bower_components/bootstrap/fonts', 'fonts');

  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src(['public/app/**/*.html'])
    .pipe(assets)
    .pipe($.if('*.js', $.ngAnnotate()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', cssChannel()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('public/dist'));
});

gulp.task('ejs', ['styles'], function() {
  var lazypipe = require('lazypipe');
  var cssChannel = lazypipe()
      .pipe($.csso)
      .pipe($.replace, 'public/bower_components/bootstrap/fonts', 'fonts');

  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src(['views/*.ejs'])
      .pipe(assets)
      .pipe($.if('*.js', $.ngAnnotate()))
      .pipe($.if('*.js', $.uglify()))
      .pipe($.if('*.css', cssChannel()))
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.if('*.ejs', $.minifyHtml({conditionals: true, loose: true})))
      .pipe(gulp.dest('dist/views'));
});

gulp.task('images', function() {
  return gulp.src('public/app/images/**/*')
     .pipe($.cache($.imagemin({
       progressive: true,
       interlaced: true
     })))
    .pipe(gulp.dest('public/dist/images'));
});

gulp.task('fonts', function() {
  return gulp.src(bower.concat('public/app/styles/fonts/**/*')
    .concat('public/bower_components/bootstrap/fonts/*')
  )
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('public/dist/fonts'))
    .pipe(gulp.dest('public/app/fonts'))
    .pipe(gulp.dest('public/.tmp/fonts'))
});

gulp.task('extras', function() {
  return gulp.src([
    'public/app/*.*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist', 'public/dist']));
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

  gulp.src('public/app/styles/*.less')
    .pipe(wiredep())
    .pipe(gulp.dest('public/app/styles'));

  gulp.src('public/app/*.html')
    .pipe(wiredep({exclude: exclude}))
    .pipe(gulp.dest('app'));

  gulp.src('public/test/*.js')
    .pipe(wiredep({exclude: exclude, devDependencies: true}))
    .pipe(gulp.dest('public/test'));
});



gulp.task('builddist', ['jshint', 'html','ejs', 'images', 'fonts', 'extras', 'styles'],
  function() {
  return gulp.src('public/dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('build', ['clean'], function() {
  gulp.start('builddist');
});


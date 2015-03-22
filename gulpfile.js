// http://markgoodyear.com/2014/01/getting-started-with-gulp/
// https://github.com/google/web-starter-kit/blob/master/gulpfile.js
// http://www.justinmccandless.com/blog/A+Tutorial+for+Getting+Started+with+Gulp

var gulp = require('gulp'),
//    sass = require('gulp-ruby-sass'),
    mainBowerFiles = require('main-bower-files'),
    filter = require('gulp-filter')
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
//    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    //notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');
//    browserSync = require('browser-sync'),
//    reload = browserSync.reload;

// copy the html files
gulp.task('copy', function() {
  return gulp.src('src/*.html')
  .pipe(gulp.dest('dist'))
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*')
  .pipe(gulp.dest('dist/assets/img'))
});

gulp.task('videos', function() {
  return gulp.src('src/vid/**/*')
  .pipe(gulp.dest('dist/assets/vid'))
});

gulp.task('styles', function() {
  return gulp.src('src/styles/*.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'));
    //.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify()
      .on('error', function(e) { 
        console.log('\x07',e.message);
        return this.end(); 
      }))
    .pipe(gulp.dest('dist/assets/js'));
    //.pipe(notify({ message: 'Scripts task complete' }));
});

// http://andy-carter.com/blog/a-beginners-guide-to-package-manager-bower-and-using-gulp-to-manage-components
gulp.task('bowerjs', function(){
  return gulp.src(mainBowerFiles())
  .pipe(filter('*.js'))
  .pipe(concat('bower.js'))
  .pipe(gulp.dest('dist/assets/js'))
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .on('error', function(e) { 
    console.log('\x07',e.message);
    return this.end(); 
  })
  .pipe(gulp.dest('dist/assets/js'))

})

gulp.task('clean', function(cb) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});

gulp.task('default', function() {
  gulp.start('copy', 'styles', 'scripts');
});

gulp.task('rebuild', ['clean'], function() {
  gulp.start('copy', 'styles', 'scripts', 'images', 'bowerjs');
});

gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/img/**/*', ['images']);

  // Watch image files
  //gulp.watch('src/vid/**/*', ['videos']);

  // Watch html and base files
  gulp.watch('src/*.html', ['copy']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);

});
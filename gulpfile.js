// var gulp = require('gulp');
// var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');
// var coffee = require('gulp-coffee');
// var es = require('event-stream')

// // gulp.task('coffee', function() {
// //   return gulp.src('assets/js/*.coffee')
// //   .pipe(coffee())
// //   .pipe(gulp.dest('src'));
// // });

// gulp.task('scripts', function() {
//   var coffeescript = gulp.src('assets/js/*.coffee')
//   .pipe(coffee());

//   var js = gulp.src('assets/js/*.js');

//   return es.merge(coffeescript, js)
//   .pipe(concat('all.min.js'))
//   .pipe(uglify())
//   .pipe(gulp.dest('dist'));
// });

// gulp.task('watch', function() {

//   gulp.watch('assets/js/*.{js,coffee}', ['scripts']);

// });

var gulp = require('gulp'),
$ = require('gulp-load-plugins')(),
Roots = require('roots'),
path = require('path'),
coffeeScript = require('coffee-script/register');
var browserSync = require('browser-sync').create();
var del = require('del');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var markdown = require('gulp-markdown-to-json');


gulp.task('roots:init', function(){
  return Roots.new({
    path: path.join(__dirname)
  }).done(function() {
    console.log("roots is ready");
  }, function(err){
    console.error("oh no! " + err);
  });
});

gulp.task('roots:compile', function(){
  return require('child_process').exec('roots compile', {cwd: './'}).on('exit', function(){
    browserSync.init({
      server : {
        baseDir : './public/'
      }
    })
  });
});

gulp.task('roots:recompile', function(){
  return require('child_process').exec('roots compile', {cwd: './'}).on('exit', function(){browserSync.reload()});
});

gulp.task('roots:deploy', function(){
  var project = new Roots(path.join(__dirname, '/'));
  return project.deploy({to: 'public'})
    .done(function(){
      console.log('finished!');
    }, function(err){
      console.log('uh oh... ' + err);
  });
});

gulp.task('images', function(){
  return gulp.src('./images/*')
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./assets/img'));
});

gulp.task('images', function(){
  return gulp.src('./images/*')
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./assets/img'));
});

gulp.task('clean', function(cb){
  del(['./public/**/*'], cb);
});

gulp.task('markdown', function(){
  gulp.src('posts/*.md')
    .pipe(gutil.buffer())
    .pipe(markdown({
      pedantic:true,
      smartypants: true

    }))
    .pipe(gulp.dest('data'))
});

gulp.task('watch', function(){
  gulp.watch([
    'views/**/*',
    'assets/**/*',
    'app.coffee',
    'app.production.coffee',
    '!public/**/*'],
    ['roots:recompile']);
  gulp.watch('images/*', ['images']);
  gulp.watch('svg/*.svg', ['vectors']);
  gulp.watch('posts/*.md', ['markdown']);
});

gulp.task('default', function(){
  runSequence('clean', 'images', 'markdown', 'roots:compile',  'watch');
});
// Clean dir & clone gulp-studio in separate dir, then transport studio back in to ./
var gulp = require('gulp'),
  rimraf = require('rimraf');
  shell = require('gulp-shell');
    
  gulp.task('cleandir', function() {
  return gulp.src('./', { read: false }) // much faster
    .pipe(ignore('node_modules/**'))
    .pipe(rimraf());
});

    gulp.task('clone-studio', shell.task([
  'git clone https://github.com/djfrsn/gulp-studio.git'
]))

    gulp.task('liftStudio', function() {
      return gulp.src(setup.studio)
        .pipe(gulp.dest(setup.root));
});

    gulp.task('houston', function() {
    gulp.src(sourced.app)
        .pipe(notify('Studi˚ has landed'));
});
    gulp.task('clear-studio', function (cb) {
    rimraf('./gulp-studio', cb);
});

    gulp.task('setup', function(callback) {
        runSequence( 'clear-studio', 'clone-studio', 'liftStudio', 'clear-studio', 'houston',
          callback);
    });


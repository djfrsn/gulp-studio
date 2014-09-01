var gulp = require('gulp');

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('paint-scaffold', function(callback) {
		runSequence( ['scaffold', 'bs-reload'],
	      [ 'scaffold', 'bs-reload' ],
	      callback);
});

gulp.task('paint', [ 'setWatch', 'browser-sync'], function () {
    gulp.watch([ sourced.sass, sourced.ignoreCritCSS, sourced.ignoreCritSASS],
     	['styles']);
    gulp.watch([ sourced.html ],
    	['paint-scaffold']);
    gulp.watch([ sourced.jsdir],
    	['brush']);
});
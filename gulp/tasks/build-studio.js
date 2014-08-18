// Run build task & transport to 'dist/'
var gulp = require('gulp'),
	rimraf = require('rimraf'); // rimraf directly


	gulp.task('clean', function (cb) {
    rimraf('./dist', cb);
	});
	gulp.task('buildstudioMsg', function() {
		gulp.src(sourced.app)
  			.pipe(notify('Studi˚ built ≈'));
	});


	gulp.task('crit', function(callback) {
			runSequence( 'compile-critical', 'scaffold', 'inline-critical', 
				      callback); // Compile crit css, then refresh index head with new script
	}); // tag using scaffold, finally we can convert the script tag to inline css with inline-critical


	// This will run in this order:
	// * styles-build, compile-critical  in series
	// * scaffold and build-aux in parallel
	// * inline-critical, build-scaffold in series
	// * Finally call the callback function
gulp.task('build-studio', function(callback) {
		runSequence( 'clean', 'build-styles', 'compile-critical', 'autoprefixCriticalCSS',
	      ['scaffold', 'brush', 'build-aux'],
	      'inline-critical', 'build-scaffold', 'buildstudioMsg',
	      callback);
});
 
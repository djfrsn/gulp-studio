// Run build task & transport to 'dist/'
var gulp = require('gulp'),
	rimraf = require('rimraf'),
	prefix = require('gulp-autoprefixer'), // https://github.com/ai/autoprefixer
	smoosher = require('gulp-smoosher'), // https://github.com/gabrielflorit/gulp-smoosher
	uglify = require('gulp-uglify');

	gulp.task('clean', function (cb) {
    rimraf('./dist', cb);
	});

	gulp.task('compile-critical', function () {

    return gulp.src(sourced.criticalSASS)
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(sass({sourcemap: false, style: 'expanded'}))
        .pipe(prefix('last 2 version', "> 1%", "Firefox ESR", "Opera 12.1", "ie 9", "ie 8", "ie 7"))
        .pipe(gulp.dest(sourced.criticaldir));
	});
	    
	gulp.task('dist-fonts', function() {
	
		return gulp.src(sourced.fonts) 
			.pipe(gulp.dest(dist.fonts));
	});


	gulp.task('uglify-js', function() {
	
	  return gulp.src(sourced.brush)
	  	.pipe(plumber({errorHandler: notify.onError()}))
	  	.pipe(uglify())
	    .pipe(gulp.dest(sourced.brushdir))
	});

	gulp.task('inline-critical',function () {

        return gulp.src(sourced.index)
        .pipe(smoosher())
        .pipe(gulp.dest(sourced.app));
    });

    imagemin   = require('gulp-imagemin'); // https://github.com/sindresorhus/gulp-imagemin
	
	gulp.task('build-imgs', function() {
	
		return gulp.src(sourced.imgs)
			.pipe(imagemin()) // Optimize imgs
			.pipe(gulp.dest(dist.imgs));
	});


	gulp.task('buildstudioMsg', function() {
		gulp.src(sourced.app)
  			.pipe(notify('Studi˚ built ≈vy'));
	});

	// This will run in this order:
	// * styles-build, compile-critical  in series
	// * scaffold and build-aux in parallel
	// * inline-critical, build-scaffold in series
	// * Finally call the callback function
gulp.task('build-studio', function(callback) {
		runSequence( 'clean', 'build-styles', 'compile-critical',
	      [ 'scaffold', 'brush', 'dist-fonts' ],
	      'uglify-js', 'inline-critical', 
	      [ 'build-imgs', 'build-brush', 'build-scaffold' ],
	      'buildstudioMsg',
	      callback);
});
 
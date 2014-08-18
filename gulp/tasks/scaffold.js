// Compile scaffold file-includes & transform to 'app/index.html'
var gulp = require('gulp'),
	remember = require('gulp-remember'), 
	rename = require("gulp-rename");

gulp.task('scaffold', function() {

	return gulp.src(sourced.html)
		.pipe(changed(sourced.includes))
		.pipe(remember(sourced.easel))
		.pipe(plumber({errorHandler: notify.onError()}))
		.pipe(fileinclude())
		.pipe(rename("index.html"))
		.pipe(gulp.dest(sourced.app))
		.pipe(browserSync.reload({stream:true, once: true}));
});
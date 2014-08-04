// Task Template
var gulp = require('gulp');

gulp.task('newTask', function () {

    return gulp.src(sourced.app)
    	// do something here
    	.pipe(gulp.dest(dist.dir));
});  
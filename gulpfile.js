'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    app = {
        dir: './',
        root: './app/',
        bower: './app/bower_components/',
        fonts: './app/styles/fonts/*',
        imgs: './app/imgs/**/*',
        index: './app/index.html',
        html: './app/*.html',
        paint: './app/styles/paint.css',
        css: './app/**/**/*.css',
        scss: './app/styles/**/*.scss',
        styles: './app/styles/',
        LAB: ['./app/scripts/LAB.js', './app/scripts/brush.x.js'],
        brush: './app/scripts/brush.js',
        brushx: './app/scripts/brush.x.js',
        app: './app/scripts/app/',
        aux: [ 'app/*.{ico,png,txt,md}', 'app/.htaccess'],
        js: './app/scripts/'
    },
    dist = {
        index: './dist/index.html',
        styles: './dist/styles/',
        css: './dist/styles/*.css',
        paint: './dist/styles/paint.css',
        rootjs: './dist/scripts/*.js',
        js: './dist/scripts/',
        fonts: './dist/styles/fonts/',
        imgs: './dist/imgs/',
        root: './dist/'
    };

gulp.task('cleanscripts', function (cb) {
    var rimraf = require('rimraf'); 
        rimraf('dist/scripts/fonts.js', cb);
});

gulp.task('clean', function (cb) {
    var rimraf = require('rimraf'); 
        rimraf(dist.root, cb);
});

gulp.task('lint', function () {
    var stylish = require('jshint-stylish');

    return gulp.src(app.brush)
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish));
});

gulp.task('comb', function() {

    return gulp.src(app.scss)   
        .pipe($.comb())
        .pipe(gulp.dest(app.styles));
});

gulp.task('images', function () {

    return gulp.src(app.imgs)
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(dist.imgs));
});

gulp.task('fonts', function () {
    return gulp.src(app.fonts)
        .pipe(gulp.dest(dist.fonts));
});

gulp.task('misc', function () {
    return gulp.src(app.aux)
        .pipe(gulp.dest(dist.root));
});

gulp.task('LAB', function () {
    return gulp.src(app.LAB)
        .pipe(gulp.dest(dist.js));
});

gulp.task("replace", function() {

    return gulp.src(['app/scripts/fonts.js'])
        .pipe($.replace('../', ''))
        .pipe(gulp.dest(dist.js));
});

gulp.task("inline", function() {

    return gulp.src(dist.index)
        .pipe($.inlineSource())
        .pipe(gulp.dest(dist.root));
});
gulp.
task('copystyles', function () {
    return gulp.src([dist.paint])
        .pipe($.rename({
            basename: "site" // site.css
        }))
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('uglify', function () {

    gulp.src(dist.rootjs)
    .pipe($.uglify())
    .pipe(gulp.dest(dist.js))
});

gulp.task('build-styles', function () {
    var moreCSS = require('gulp-more-css');

    gulp.src(dist.css)
    .pipe($.autoprefixer('> 1%'))
    .pipe($.filesize())
    .pipe($.uncss({
        html: ['./app/index.html']
    }))
    .pipe($.combineMediaQueries({ log: true }))
    .pipe(moreCSS({radical: true}))
    .pipe($.filesize())
    .pipe(gulp.dest(dist.styles))
});

gulp.task('styles', function () {
    var paint = function (err) {  
        $.util.log('paint(err):', $.util.colors.red(err.message));
        $.util.beep();
    };

    return gulp.src(app.scss)
        .pipe($.plumber({errorHandler: paint}))
        .pipe($.sass({
            precision: 10
        }))
        .pipe(gulp.dest(app.styles));
});

gulp.task('browserify', function () {
  var transform = require('vinyl-transform'),
      browserify = require('browserify');

    var brush = function (err) {  
        $.util.log('brush(err):', $.util.colors.white(err.message));
        $.util.beep();
    };

  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });
  
  return gulp.src(app.brush)
    .pipe($.plumber({errorHandler: brush}))
    .pipe(browserified)
    .pipe($.rename('brush.x.js'))
    .pipe(gulp.dest(app.js));
});

gulp.task('core', ['browserify'], function () {
    var assets = $.useref.assets();

    return gulp.src(app.html)
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(dist.root));
});

gulp.task("rev", ['core'], function() {
  var assets = $.useref.assets();

  return gulp.src(app.html)
    .pipe(assets)
    .pipe($.rev())                // Rename the concatenated files
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())         // Substitute in new filenames
    .pipe(gulp.dest(dist.root));
});
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src(app.scss)
        .pipe(wiredep({
            directory: app.bower
        }))
        .pipe(gulp.dest(app.styles));

    gulp.src(app.html)
        .pipe(wiredep({
            directory: app.bower
        }))
        .pipe(gulp.dest(app.root));
});

gulp.task('connect', function () {
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(serveStatic('app'))
        .use(serveIndex('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function() {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('browser-sync', function() {
    var browserSync = require('browser-sync');
    browserSync({
            proxy: "http://localhost:9000/",
            notify: false,
    });

});

gulp.task('serve', ['styles', 'connect', 'browser-sync'], function () {

    $.livereload.listen();

    gulp.watch([
        app.html,
        app.css,
        app.js,
        app.imgs
    ]).on('change', $.livereload.changed);
    
    gulp.watch(app.scss, ['styles']);
    gulp.watch(app.brush, ['browserify']);
    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('finale', function() {
    $.util.log(
        $.util.colors.dim.underline('App'),
        $.util.colors.blue('built'),
        $.util.colors.dim('&'),
        $.util.colors.red('compressed'),
        $.util.colors.yellow('->'),
        $.util.colors.green('dist')
    );
    $.util.beep();
    $.util.beep();
    gulp.src(app.root)
    .pipe($.shell([
      'cd dist; zip -r ../dist.zip *',
    ],
    {
         quiet: true
    }));
});

gulp.task('build', ['clean'], function(callback) {
    var runSequence = require('run-sequence');
    runSequence( [ 'replace', 'LAB', 'lint', 'images', 'fonts', 'misc', 'rev'],
      'inline', 'cleanscripts', 'uglify', 'build-styles', 'finale',
      callback);
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

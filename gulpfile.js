'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    app = {
        dir: './',
        root: './app/',
        bower: './app/bower_components/',
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
        imgs: './dist/imgs/',
        root: './dist/'
    },
    paint = function (err) {  
        $.util.log('paint(err):', $.util.colors.red(err.message));
        $.util.beep();
    },
    AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];

gulp.task('cleanscripts', function (cb) {
    var rimraf = require('rimraf'); 
        rimraf('dist/scripts/fonts.js', cb);
});

gulp.task('clean', function (cb) {
    var rimraf = require('rimraf'); 
        rimraf(dist.root, cb);
});

gulp.task('images', function () {
    return gulp.src(app.imgs)
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(dist.imgs));
});

gulp.task('misc', function () {
    return gulp.src(app.aux)
        .pipe(gulp.dest(dist.root));
});

gulp.task("replace", function() {
    return gulp.src(['app/scripts/fonts.js'])
        .pipe($.replace('../', ''))
        .pipe(gulp.dest(dist.js));
});

gulp.task('lint', function () {
    var stylish = require('jshint-stylish');

    return gulp.src(app.brush)
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish));
});

gulp.task('uglify', function () {
    return gulp.src(dist.rootjs)
        .pipe($.uglify())
        .pipe(gulp.dest(dist.js))
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

gulp.task("inline", function() {
    return gulp.src(dist.index)
        .pipe($.inlineSource())
        .pipe(gulp.dest(dist.root));
});

gulp.task('filesize', function () {
    return gulp.src(sourced.css)
        .pipe($.filesize())
});

gulp.task('comb', function() {
    return gulp.src(app.scss)   
        .pipe($.comb())
        .pipe(gulp.dest(app.styles));
});

gulp.task('atomic', function() {
    return gulp.src(sourced.index)
        .pipe($.concat('_atomic.scss'))
        .pipe($.atomic())
        .pipe(gulp.dest(sourced.styles));
});

gulp.task('sass', function () {
    return gulp.src(app.scss)
        .pipe($.plumber({errorHandler: paint}))
        .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe($.sass({
            precision: 10
        }))
        .pipe(gulp.dest(app.styles));
});

gulp.task('core', ['sass', 'filesize', 'browserify'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']}); // try implementing this in the other useref

  return gulp.src(app.index)
    .pipe(assets)
    .pipe($.rev()) 
    .pipe($.if('*.css', $.moreCSS({radical: true})))
    .pipe($.if('*.css', $.uncss({
            html: ['./app/index.html']
        })))
    .pipe($.if('*.css', $.combineMq()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())  
    .pipe(gulp.dest('dist'));
});

gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    return  gulp.src(app.scss)
        .pipe(wiredep({
            directory: app.bower
        }))
        .pipe(gulp.dest(app.styles));

    return  gulp.src(app.html)
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
    runSequence( [ 'replace', 'lint', 'images', 'misc', 'core' ],
      'filesize', 'cleanscripts', 'uglify', 'build-styles', 'finale',
      callback);
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

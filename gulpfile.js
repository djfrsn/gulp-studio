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
        webcomponents: [
        './app/web-components/**/**/*.html', 
        './app/web-components/**/**/*.css', 
        './app/web-components/**/**/*.js'
        ],
        paintcss: './app/styles/paint.css',
        css: './app/**/**/*.css',
        scss: './app/styles/**/*.scss',
        styles: './app/styles/',
        brush: './app/scripts/brush.js',
        js: './app/scripts/'
    },
    dist = {
        webcomponents: './dist/web-components/',
        index: './dist/index.html',
        styles: './dist/styles/',
        js: './dist/scripts/',
        fonts: './dist/styles/fonts/',
        imgs: './dist/imgs/',
        aux: [ 'app/*.{ico,png,txt,md}', 'app/.htaccess'],
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
    return gulp.src(dist.aux)
        .pipe(gulp.dest(dist.root));
});

gulp.task('webcomponents', function () {
    return gulp.src(app.webcomponents)
        .pipe(gulp.dest(dist.webcomponents));
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

gulp.task('styles', function () {
    var Style = function (err) {  
        $.util.log('Style(err):', $.util.colors.red(err.message));
        $.util.beep();
    };

    return gulp.src(app.scss)
        .pipe($.plumber({errorHandler: Style}))
        .pipe($.sass({
            precision: 10
        }))
        .pipe(gulp.dest(app.styles));
});

gulp.task('html', ['styles'], function () {
    var assets = $.useref.assets();

    return gulp.src(app.html)
        .pipe(assets)
        .pipe($.if('*.css', $.autoprefixer('> 1%')))
        .pipe($.filesize())
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.combineMediaQueries({ log: true })))
        .pipe($.if('*.css', $.minifyCss()))
        .pipe($.filesize())
        .pipe($.rev())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace()) 
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
      'tar -jcvf dist/app.tar.bz2 dist',
    ],
    {
         quiet: true
    }));
});

gulp.task('build', ['clean'], function(callback) {
    var runSequence = require('run-sequence');
    runSequence( [ 'replace', 'lint', 'images', 'fonts', 'misc', 'html', 'webcomponents'],
      'inline', 'cleanscripts', 'finale',
      callback);
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

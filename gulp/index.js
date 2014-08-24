var fs = require('fs');
	onlyScripts = require('./util/scriptFilter');
	tasks = fs.readdirSync('./gulp/tasks/').filter(onlyScripts);
	setup = {
		studio: [
        './gulp-studio/**/**/**/**/*.*'
    	],
		root: './'
	}
	sourced = {
		app: 'app/',
		easel: 'app/easel.html',
		fonts: './app/lib/fonts/**/*',
		imgs: './app/lib/imgs/**/*',
		index: 'app/index.html',
		html: [ 'app/lib/includes/**/*.html', 'app/easel.html' ],
		includes: 'app/lib/includes/**/*.html',
		sass: 'app/lib/styles/**/*.scss',
		css: 'app/lib/styles/paint.css',
		criticalSASS: 'app/lib/styles/critical/**/*.scss',
		criticalCSS: 'app/lib/styles/critical/critical.css',
		criticaldir: 'app/lib/styles/critical/',
		styles: 'app/lib/styles/',
		brush: 'app/lib/js/brush/brush.js',
		brushdir: 'app/lib/js/brush/', 
		jsdir: 'app/lib/js/**/*.js',
		jslib: [ 'app/lib/js/vendor/*.js', 'app/lib/js/components/component.js' ], // js is concatenated from left to right 
		ignoreSASS: '!app/lib/styles/**/*.scss',
		ignoreCritCSS: '!app/lib/styles/critical/*.css',
		ignoreCritSASS: '!app/lib/styles/critical/**/*.scss'
	};
	dist = {
		styles: 'dist/lib/styles/',
		js: 'dist/lib/js/brush/',
		fonts: 'dist/lib/fonts/',
		imgs: 'dist/lib/imgs/',
		aux: [ 'app/humans.txt', 'app/robots.txt', 'app/favicon.ico' ],
		dir: 'dist/'
	};

tasks.forEach(function(task) {
	require('./tasks/' + task);
});

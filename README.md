## Studi˚

[Repository of modern web development tooling and components](http://studio.dennisjefferson.com)....batmans tool bet. 

## Quickstart

[Download](https://github.com/djfrsn/studio/archive/master.zip) or 

```sh
git clone https://github.com/djfrsn/studio.git 
```
then

Install dependencies

```sh
npm install
```
Run 

```sh
gulp
```
Vivy!

Head to app/easel.html & start building your creation here 

Use

```sh
@@include('include/hello.html')
```

format to include files. Easel includes will get compiled into index.html.  

## Filesystem 
When you run 

```sh
gulp
```
our gulpfile.js loads and points to /gulp, an index.js file loads some error handling utilities, then checks /gulp/task/ for any gulp task and loads them. 'default.js' along with any seperate task call 'gulp' recursively, thus looping task together while keeping them in seperate .js files.

To create a new gulp task, create a .js file and add this

```sh
var gulp = require('gulp');

gulp.task('newTask', function () {
	var source = 'my/source';
	var dest = 'my/dist';
	// do something
	return gulp.src(source)
	.pipe(gulp.dest(dest));
});  
```
Test your task with 

```sh
gulp newTask
```

Refer to community docs/write ups for details on how to customize your task further

Watch is the default task. In watch we split gulp task at high levels such as:
+ Img - Compress Images
+ Styles - Run task on stylesheets w/ support for minification, [combing](https://www.npmjs.org/package/gulp-csscomb), autoprefixing & only processing changed files 
+ Scaffold - Run task on HTML files w/ support for processing changed files only
+ build-aux - Grab misc files out of your app folder, ie .ico files


## Tooling

Aiming for a robust toolbelt.....yet I still want to watch the weight(see: speed), so we will see. 

### Clean Up & Reports

Expect linting, tidying/cleaning, filesize diff checks, & error checking w/ notify to occur during dev/build task for scaffold, sass & js. 

### Task Performance

['gulp-newer'](https://github.com/tschaub/gulp-newer) & ['gulp-cached'](https://github.com/wearefractal/gulp-cached) run for each gulp task. 

Gulp task can be 2-3x faster with cache & 'newer' than without after files are cached(second run). 

### JS

+ Coffescript 
+ jQuery

### Scaffold w/ Easel

+ Include files in easel.html ... usage: @@('include/thisFile.xtn')
+ Minification w/ htmlmin

### Style w/ Paint

+ Check for changed files
+ Compile w/ gulp-ruby-sass & create sass sourcemaps
+ Autoprefix for last 2 version > 1% + Firefox ESR, Opera 12.1, ie7-9
+ cssComb w/ 'zen' config
+ Gulp-Notify if (err) log message
#### Styles-Build
+ Run gulp-minify-css

### Img

+ Run imgmin default options

### Aux

+ Bring over preset files from your app folder

### Gulp Commands

#### Automate w/ Bash

Place this in your bash file....Yeoman replacement coming soon

```sh 
    alias drop="mkdir newStudio; cd newStudio;"
    function studio {
        git clone https://github.com/djfrsn/studio.git .
        # this runs through pkg.json's listed dependencies & downloads them
        npm install
        gulp
    }
```

Then run 
```sh
drop studio
```
to create a new project. 

Quick commands for your bash_profile: 

```sh
alias g="gulp"
alias gs="gulp styles"
alias gsb="gulp styles-build"
alias gjs="gulp script"
alias gjsb="gulp script-build"
alias gh="gulp scaffold"
alias ghb="gulp build-scaffold"
alias gb="gulp build"
alias gw="gulp watch"
```

#### Watch For Changes & Automatically Refresh Across Devices

```sh
$ gulp watch
```

This boots a connect server that loads your project in the browser, then watches your files for changes & live updates. 

### Build & Optimize

```sh
$ gulp build
```

Run build versions of default task:
+ Styles - Compile, prefix, comb('zen'), minify, check for errors & pipe to dest.
+ Img - Run imgmin default settings
+ Scaffold - 
+ Aux - Grabs misc files parallel to index.html path & provides performance insights w/ pagespeed

### Testing

Using bash to test all modules.......I know its ugly...but it works. 

#### Gulp Studi˚ CLI commands

```sh
# Gulp Studi˚ 
alias gu="gulp"
alias gstu="gulp studio"
alias gs="gulp styles"
alias gsb="gulp build-styles"
alias gj="gulp js"
alias gjb="gulp build-js"
alias gsc="gulp scaffold"
alias gscb="gulp build-scaffold"
alias ga="gulp aux"
alias gab="gulp build-aux"
alias gc="gulp compile-critical"
alias gic="gulp inline-critical"
alias gpe="gulp prettify-easel"
alias gb="gulp build-studio"
alias gw="gulp watch"
alias test1="gs; gc; gsc; gic; gpe; gstu;"
alias test2="gsb; gc; gsc; gab; gic; gscb; gb;"
function tests {
    test1
    test2
}
```

Run test1, test2, or tests 

Will create a test-studio task w/ run sequence for self testing

## Config

#### Paths

List paths to config here...

## Vendor CSS 

h5bp

## Web Performance

+ Single css link + critical css served
+ Single js link....would like to include automatically updating jquery include....

## Browser Support

I have these browsers in mind so far:

* IE10, IE11
* Evergreen browsers

Will add mobile browsers 

## Troubleshooting

Contact me

## A Boilerplate-only Option

Remove lib folder & reconfigure source paths in /gulp/task

## Inspiration

Studio is inspired by a desire to build a platform with modern tooling & best practices baked in, while leaving the door wide open to build anything possible with HTML, CSS, Javascript and other web technologies.

## Contributing

## Milestones

#### Paint & Easel v 0.0.1 

--- Modules tested: 
+ aux 
+ img
+ scaffold
+ studio
+ styles
+ compile-critical
+ inline-critical
+ prettify-easel
+ styles
+ watch
+ studio

Contributions, questions and comments are all welcome and encouraged.

## Credits

[Google Web Starter Kit](https://github.com/google/web-starter-kit)
    Readme template & being the "gold standard"

[Greypants gulp-starter](https://github.com/greypants/gulp-starter)
    Gulp framework & filesystem 

## License

hmmm? Supposedly BSD-2

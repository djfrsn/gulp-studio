## Studi˚

[Prototype Gulp task runner](http://studio.dennisjefferson.com) for building websites/apps. 

## Features

Gives you live reload for html/js and style injection for css. This is provided through a connect server and browser sync. Libsass handles your .scss files. Bower integration is available through [wiredep](https://github.com/taptapship/wiredep), take a look at the README there to understand the Bower capabilities of Studi˚. Essentially anytime you install a js or css file with bower those dependencies are automagically added to your html file. Browserify is available to require modules in your javascript files with require('script').

[LABjs](http://labjs.com/) added for async js script loading. 

To use async font loading take a look at this [link](http://bdadam.com/blog/loading-webfonts-with-high-performance.html). This shows how the code in app/scripts/font.js is used to async load scripts out of your app/style/fonts directory. 

The build command has a host of task that run. 

A few of those are. 

#### CSS

- more-css - a css pre-compiler & agressive compressor
- uncss - Remove unused styles from CSS
- autoprefixer
- combine-media-queries
- gulp-rev - Static asset revisioning by appending content hash to filenames: unicorn.css → unicorn-098f6bcd.css


#### Images

- imagemin - Minify PNG, JPEG, GIF and SVG images


#### JS

- JSHint
- Ugilify JS - minification
- Browserify - bundle 

Some utility task to run during development: 

'gulp comb' - makes all your scss code beautiful

'gulp atomic' runs atomicscss - this scans your html for class attributes and generates an scss file from the classes


## Quickstart

Install Gulp if you havent! 

Deploy scaffolding with [Slush-Studio](https://github.com/djfrsn/slush-studio). This also gives access to a version of Studi˚ that works with Wordpress using Vagrants.

or

```sh
mkdir studio && cd studio && git clone https://github.com/djfrsn/gulp-studio.git .
```

Install dependencies

```sh
npm install
```

Run

```sh
gulp paint
```
This kickstarts a connect server w/ browsersync that opens up a blank project in your browser. Vivy!


---

Contributions, questions and comments are all welcome and encouraged.


#### Status

Studi˚'s HTML option has been finalized in the past few weeks. Not much testing has been done so slight modification of the gulp file may be necessary in some cases.

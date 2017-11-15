// Gulp plugins
var gulp      = require('gulp');
var prefix    = require('gulp-autoprefixer');
var clean     = require('gulp-clean-css');
var notify    = require('gulp-notify');
var plumber   = require('gulp-plumber');
var sass      = require('gulp-sass');
var maps      = require('gulp-sourcemaps');

// Other plugins
var sequence  = require('run-sequence');
var sync      = require('browser-sync');
var del       = require('del');

// Project build directories
var config = {
  src: 'dev/',
  dest: 'app/'
}

// Prompt any error then end current task
function customPlumber(errTitle) {
  return plumber({
    errorHandler: notify.onError({
      // Custom error title
      title: errTitle || "Error running Gulp",
      message: "Error: <%= error.message %>",
    })
  });
}

// Activates browser sync to automatically update browser upon detecting changes
gulp.task('sync', function() {
  sync({
    // Set base directory of server to root folder
    server: { baseDir: 'app/pages/' },
    // Prevents browsers from opening automatically
    open: true,
    // Disable pop-over notification
    notify: true
  })
});

// Clean out files prior to build
gulp.task('delete', function(callback) {
    return del(config.dest, callback);
});

// Compile all sass into css
gulp.task('styles', function() {
  var sassOptions = { outputStyle: 'compressed' };
  var autoprefixerOptions = { browsers: ['last 2 versions', '> 5%', 'Firefox ESR'] };

  return gulp.src(config.src + 'scss/**/*.scss')
    .pipe(customPlumber('Error Running Sass'))
    // Initialize sourcemaps
    .pipe(maps.init())
    .pipe(sass(), sass(sassOptions))
    // Add prefixes for IE8, IE9 and last 2 versions of all other browsers
    .pipe(prefix(autoprefixerOptions))
    // Write sourcemaps
    .pipe(maps.write())
    .pipe(gulp.dest(config.dest + 'css'))
    .pipe(notify({ message: 'Styles Complete!', onLast: true }))
    // Tells browser sync to reload files when task is done
    .pipe(sync.reload({ stream: true }))
});

// Clean out files prior to build
gulp.task('pages', function() {
  return gulp.src(config.src + 'pages/**/*.html')
    .pipe(customPlumber('Error Running Pages'))
    .pipe(gulp.dest(config.dest + 'pages'))
    .pipe(notify({ message: 'Pages Complete!', onLast: true }))
    // Tells browser sync to reload files when task is done
    .pipe(sync.reload({ stream: true }))

});

// Watch specified folders and files for any changes
gulp.task('watch', function() {
  gulp.watch(config.src + 'scss/**/*.scss', ['styles']);
  gulp.watch(config.src + 'pages/**/*.html', ['pages']);
});

// Executes a sequence of tasks
gulp.task('default', function(callback) {
  sequence(
    ['delete'],
    ['styles', 'pages'],
    ['sync', 'watch'],
    callback
  )
});
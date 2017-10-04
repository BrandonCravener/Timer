const del = require('del')
const gulp = require('gulp')
const pump = require('pump')
const copy = require('gulp-copy')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')

gulp.task('clean', function() {
    del.sync(['./dist']);
})

gulp.task('minify-css', () => {
    return gulp.src(['./app/css/*.css', '!app/css/*.min.css'])
      .pipe(cleanCSS({debug: true}, function(details) {
        console.log(details.name + ': ' + details.stats.originalSize)
        console.log(details.name + ': ' + details.stats.minifiedSize)
      }))
    .pipe(gulp.dest('./dist/css/'))
});

gulp.task('uglifyjs', function (cb) {
    pump([
          gulp.src(['app/js/*.js', '!app/js/*.min.js']),
          uglify(),
          gulp.dest('./dist/js/')
      ],
      cb
    );
});

gulp.task('copy', () => {
    return gulp.src(['!app/js/index.js', '!app/css/default.css', './app/**/**'])
        .pipe(copy('./dist/', {prefix: 1}))
})

gulp.task('generate-service-worker', function(callback) {
    let swPrecache = require('sw-precache')
    let rootDir = 'dist'
  
    swPrecache.write(`${rootDir}/service-worker.js`, {
      staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}', rootDir + '/**'],
      stripPrefix: rootDir
    }, callback)
})


gulp.task('default', ['clean', 'minify-css','uglifyjs','copy', 'generate-service-worker'])
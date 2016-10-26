var gulp = require('gulp');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var del = require('del');
var nodemon = require('gulp-nodemon');
var cache = require('gulp-cache');

gulp.task('clean',function () {
    return del(['build']);
});

gulp.task('usemin:development', ['images'], function() {
  return gulp.src('./client/**/*.html')
    .pipe(usemin({
      css: [ rev() ],
      js: [ rev() ]
    }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('usemin:production', ['clean', 'images'], function() {
  return gulp.src('./client/**/*.html')
    .pipe(usemin({
      css: [ minifyCss(), rev() ],
      js: [ uglify(), rev() ]
    }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('images', ['clean', 'copyfonts'], function () {
    
    return gulp.src('client/images/**/*')
        .pipe(gulp.dest('build/images'));

});

gulp.task('copyfonts', ['clean'], function () {
    gulp.src('bower_components/font-awesome/fonts/**/*')
        .pipe(gulp.dest('build/fonts'));
    gulp.src('bower_components/bootstrap/dist/fonts/**/*')
        .pipe(gulp.dest('build/fonts'));
});

gulp.task('watch', function () {
    return gulp.watch('./client/**/*', ['usemin:development']);
});

gulp.task('server' , ['default'], function(cb){
    
    nodemon({
        script: 'server/bin/www',
        ext: 'js'
    }).on('start', function(){
        cb(null);
    });

}); 


gulp.task('default', ['usemin:development']);
gulp.task('serve', ['server', 'watch']);
gulp.task('relase', ['usemin:production']);
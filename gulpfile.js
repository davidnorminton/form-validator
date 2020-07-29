const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const beautify = require('gulp-beautify');


// compile sass file
gulp.task('sass', function(){
   return gulp.src('app/css/style.scss')
     .pipe(sass())
     .pipe(gulp.dest('dist/css/'))
});

gulp.task('views', function buildHTML() {
  return gulp.src('app/views/*.pug')
  .pipe(pug({
    // Your options in here.
  }))
  .pipe(beautify.html({ indent_size: 2 }))
  .pipe(gulp.dest('dist/'))
});

// gulp watch for changes
gulp.task('watch', function() {
    gulp.watch('app/css/*.scss', ['sass']);
    gulp.watch('app/views/*.pug', ['views']);
});
const gulp = require('gulp');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const gulpSass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');

function prodStyles(done) {
  gulp
    .src('./scss/**/*.scss')
    .pipe(gulpSass())
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('./css/'));

  done();
}



function transformScss(done) {
  gulp.src('./scss/**/*.scss')
    .pipe(gulpSass())
    .pipe(rename('main.css'))
    .pipe(gulp.dest('./css/'));

  done();
}

const watchSass = () => gulp.watch('./scss/**/*.scss', transformScss);

gulp.task('watch', gulp.series(transformScss, watchSass));
gulp.task('prod', gulp.series(prodStyles));

const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', () => gulp.src('lib/public/css/base.scss').pipe(sass())
    .pipe(gulp.dest('lib/public/css/screen'))
);

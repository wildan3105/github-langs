const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', () => gulp.src('lib/public/css/base.scss')
    .pipe(sass({
        outputStyle: 'compressed',
        includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(gulp.dest('lib/public/css/screen'))
);

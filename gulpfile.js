const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require("gulp-rename");

gulp.task('sass', () => gulp.src('lib/public/css/base.scss')
    .pipe(sass({
        outputStyle: 'compressed',
        includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(
        rename(function (file) {
            file.basename += ".min";
        })
    )
    .pipe(gulp.dest('lib/public/css/screen'))
);

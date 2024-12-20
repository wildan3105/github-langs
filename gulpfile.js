/* eslint-disable func-style */
const {
    src,
    dest,
    series,
    watch
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');

function generateStyles(cb) {
    src('public/css/base.scss')
        .pipe(
            sass({
                outputStyle: 'compressed',
                includePaths: ['node_modules'],
                quietDeps: true
            }).on(
                'error',
                sass.logError
            )
        )
        .pipe(
            rename((file) => {
                file.basename += '.min';
            })
        )
        .pipe(
            dest('public/css/screen')
        );
    cb();
}

function watchFiles(cb) {
    watch('public/css/**/*.scss', generateStyles);
}

exports.styles = generateStyles;
exports.watch = series(generateStyles, watchFiles);

exports.default = series(generateStyles);

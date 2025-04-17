import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import rename from 'gulp-rename';

async function generateStyles() {
    gulp.src('public/css/base.scss')
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
            gulp.dest('public/css/screen')
        );
}

function watchFiles() {
    gulp.watch('public/css/**/*.scss', generateStyles);
}

export const styles = generateStyles;
export const watch = gulp.series(generateStyles, watchFiles);
export default gulp.series(generateStyles);

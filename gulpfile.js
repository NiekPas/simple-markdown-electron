var gulp =          require('gulp');
var sass =          require('gulp-sass');
var sourcemaps =    require('gulp-sourcemaps');
var shell =         require('gulp-shell');
var browserSync =   require('browser-sync').create();
var runSequence =   require('run-sequence');

// Static server
gulp.task("browser-sync", function () {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
    gulp.watch(["*.html", "css/*.scss", "js/*.ts"]).on("change", browserSync.reload);
});

gulp.task('sass', function() {
    return gulp.src('./css/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'));
});

gulp.task('typescript', shell.task('tsc'));

gulp.task("default", function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(["./js/**/*.ts", "./css/*.scss", "./index.html"], function () {
        runSequence(["sass", "typescript"], browserSync.reload);
    });
});
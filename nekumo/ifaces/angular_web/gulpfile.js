var gulp = require('gulp'),
    shell = require('gulp-shell'),
    ngmin = require('gulp-ngmin'),
    concat = require('gulp-concat'),
    replace = require('gulp-replace'),
    purge = require('gulp-css-purge'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify');

var FONTS = [
    'static/src/libs/github/Templarian/MaterialDesign-Webfont@1.8.36/fonts/*'
];

gulp.task('systemjs-build', shell.task(['node ./systemjs-build.js'], {cwd: 'static'}));

gulp.task('system-build', function () {
    return gulp.src(['static/src/libs/system-csp-production.js', 'static/config.js'])
        .pipe(concat('system-build.js'))
        .pipe(gulp.dest('static/dist/'));
});

gulp.task('minify-js', ['systemjs-build'], function () {
    return gulp.src('static/dist/*.js')
        .pipe(ngmin())
        .pipe(uglify({}))
        .pipe(gulp.dest('static/dist/'));
});

gulp.task('minify-css', ['systemjs-build'], function () {
    return gulp.src('static/dist/*.css')
        .pipe(replace('src/libs/github/Templarian/MaterialDesign-Webfont@1.8.36/fonts/', ''))
        // .pipe(purge())
        .pipe(cleanCSS())
        .pipe(gulp.dest('static/dist/'));
});

gulp.task('fonts', function () {
    return gulp.src(FONTS)
        .pipe(gulp.dest('static/dist/'));
});

gulp.task('default', [
    'system-build',
    'minify-js',
    'minify-css',
    'fonts'
]);

var gulp = require('gulp'),
    shell = require('gulp-shell'),
    ngmin = require('gulp-ngmin'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

JS_FILES = [
    'static/dist/common.js',
    'static/dist/fileManager.js',
    'static/dist/media.js'
];

gulp.task('systemjs-build', shell.task(['node ./systemjs-build.js'], {cwd: 'static'}));

gulp.task('system-build', function () {
    return gulp.src(['static/src/libs/system-csp-production.js', 'static/config.js'])
        .pipe(concat('system-build.js'))
        .pipe(gulp.dest('static/dist/'));
});

gulp.task('minify-js', ['systemjs-build'], function () {
    return gulp.src(JS_FILES)
        .pipe(ngmin())
        .pipe(uglify({}))
        .pipe(gulp.dest('static/dist/'));
});

gulp.task('default', ['system-build', 'minify-js']);

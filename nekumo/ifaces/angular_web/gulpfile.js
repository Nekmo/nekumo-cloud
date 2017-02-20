var gulp = require('gulp'),
    shell = require('gulp-shell'),
    ngmin = require('gulp-ngmin'),
    uglify = require('gulp-uglify');

JS_FILES = [
    'static/dist/common.js',
    'static/dist/fileManager.js',
    'static/dist/media.js'
];

gulp.task('systemjs-build', shell.task(['node ./systemjs-build.js'], {cwd: 'static'}))

gulp.task('minify-js', ['systemjs-build'], function () {
    return gulp.src(JS_FILES)
        .pipe(ngmin())
        .pipe(uglify({}))
        .pipe(gulp.dest('static/dist/'));
});

gulp.task('default', ['minify-js']);

var gulp = require('gulp');
var uncss = require('gulp-uncss');

// gulp.task('default', function () {  
//     return gulp.src('site.css')
//         .pipe(uncss({
//             html: ['index.html', 'posts/**/*.html', 'http://example.com']
//         }))
//         .pipe(gulp.dest('./out'));
// });

gulp.task('xxx', function () {
    return gulp.src('toolScript/gulp/before.css')
        .pipe(uncss({
            html: ['toolScript/gulp/index.html']
        }))
        .pipe(gulp.dest('./out'));
});
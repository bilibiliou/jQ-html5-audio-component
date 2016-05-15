var gulp = require('gulp'),
    uglify = require('gulp-uglify');

    gulp.task('minifyjs', function() {
    return gulp.src('./musicMedia.js')    //合并所有js到main.js
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('./dist/musicMedia.min.js'));  //输出
    });


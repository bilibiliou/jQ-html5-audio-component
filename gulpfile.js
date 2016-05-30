var gulp = require('gulp'),
    uglify = require('gulp-uglify');

    gulp.task('minifyjs', function() {
    return gulp.src('./js/musicMedia.js')    
        .pipe(uglify())    
        .pipe(gulp.dest('./js/min/musicMedia.min.js'));
    });
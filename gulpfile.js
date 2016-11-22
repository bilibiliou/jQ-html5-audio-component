let gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename");


    gulp.task('minifyjs', function() {
    return gulp.src('./js/musicMedia.js') 
        .pipe(rename({
            basename: "musicMedia",
            suffix: ".min",
            extname: ".js"
        }))   
        .pipe(uglify())    
        .pipe(gulp.dest('./js'))
    });
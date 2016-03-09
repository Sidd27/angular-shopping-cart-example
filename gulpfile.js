var gulp = require('gulp'),
    webserver = require('gulp-server-livereload');

gulp.task('default', function() {
    // place code for your default task here
    console.log("It's up and running");
});

gulp.task('webserver', function() {
    gulp.src('')
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

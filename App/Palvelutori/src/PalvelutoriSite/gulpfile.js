/// <binding AfterBuild='less' />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp'),
    less = require('gulp-less'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename');


gulp.task('watch', function () {
    gulp.watch('wwwroot/css/*.less', ['less']);
});

gulp.task('less', function () {

    return gulp.src('wwwroot/css/site.less')
    .pipe(less().on('error', function (err) {
        console.log(err);
    }))
    .pipe(cssmin().on('error', function (err) {
        console.log(err);
    }))
    //.pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('wwwroot/css/'));

});

gulp.task('copy', function () {
    // Copy BusinessForms
    gulp.src("../BusinessForms/wwwroot/Dist/*.js*").
      pipe(gulp.dest("wwwroot/Dist"));
    gulp.src("../BusinessForms/wwwroot/Dist/*.ts*").
     pipe(gulp.dest("typings/BusinessForms"));

    // Copy AngularJS
    gulp.src("node_modules/angular/angular*").
      pipe(gulp.dest("wwwroot/Dist"));
    gulp.src("node_modules/angular-route/angular-route*").
      pipe(gulp.dest("wwwroot/Dist"));
    gulp.src("node_modules/angular-animate/angular*").
      pipe(gulp.dest("wwwroot/Dist"));
    gulp.src("node_modules/angular-touch/angular*").
      pipe(gulp.dest("wwwroot/Dist"));

    // Copy Moment
    gulp.src("node_modules/moment/min/*.js").
      pipe(gulp.dest("wwwroot/Dist"));

    // Copy Pikaday
    gulp.src("node_modules/pikaday/pikaday.js").
      pipe(gulp.dest("wwwroot/Dist"));
    gulp.src("node_modules/pikaday/css/pikaday.css").
      pipe(gulp.dest("wwwroot/css"));

    // Copy FontAwesome
    gulp.src("node_modules/font-awesome/fonts/*").
      pipe(gulp.dest("wwwroot/Dist/font-awesome/fonts/"));
});

gulp.task('default', ['copy', 'less', 'watch']);
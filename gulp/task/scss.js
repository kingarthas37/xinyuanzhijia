'use strict';

var path = require('path');

var gulp = require('gulp');
var sass = require('gulp-sass');
var size = require('gulp-size');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');

var config = require('../../package.json');
var args = require('../util/arg-parse');

/******** 生成css dev ***********/
//css-common ,生成 name.external.css，增加sourcemaps
gulp.task('css-common',function() {
    return gulp.src(config['css-common'])
        .pipe(sourcemaps.init())
        .pipe(concat(config.name + '.external.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.publicPath.cssDist));
});

//页面级的css: name.default.css,执行前先执行task 'css-common',入口为public/dev/css/main.sass
//所有页面级的css管理都有main.scss控制
//增加autoprefixer功能
gulp.task('css', function () {
    return gulp.src(path.join(config.publicPath.cssDev, (args.admin ? 'admin/main.scss' : 'default/main.scss')))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(rename(config.name + (args.admin ? '.admin.css' : '.default.css')))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.publicPath.cssDist));
});


/******** 生成css dist ***********/

//css-common prod，生成 name.external.css，并增加sourcemaps和minifycss的压缩
gulp.task('css-common:prod',function() {
    return gulp.src(config['css-common'])
        .pipe(concat(config.name + '.external.css'))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(config.publicPath.cssMin));
});

//页面级css的prod，原理同上，只增加了css压缩
gulp.task('css-default:prod',['css-common:prod'], function () {
      return gulp.src(path.join(config.publicPath.cssDev,'default/main.scss'))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(rename(config.name + '.default.css'))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(config.publicPath.cssMin));
});

//admin
gulp.task('css-admin:prod',['css-common:prod'], function () {
    return gulp.src(path.join(config.publicPath.cssDev,'admin/main.scss'))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(rename(config.name + '.admin.css'))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(config.publicPath.cssMin));
});
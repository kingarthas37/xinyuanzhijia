'use strict';

var gulp = require('gulp');
var fs = require('fs');

var args = require('./util/arg-parse');

require('./task/browserify');
require('./task/clean');
require('./task/image');
require('./task/rev');
require('./task/scss');
require('./task/watch');

if(args.env === 'dev') {
    //dev task
    gulp.task('default', ['image','css-common','css','browserify','watch']);
} else if(args.env === 'prod') {
    //build task
    gulp.task('default', ['image:prod','css-common:prod','css-default:prod','css-admin:prod','browserify-admin:prod','browserify-default:prod','rev']);
}
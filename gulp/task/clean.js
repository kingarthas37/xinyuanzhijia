'use strict';

var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var del = require('del');

var args = require('../util/arg-parse');
var config = require('../../package.json');

//执行--md5，首先清除整个min目录
gulp.task('clean:rev',function() {
    
    if(!args.md5) {
        return;
    }
    
    return del.sync([
        path.join(config.publicPath.min)
    ]);
});
'use strict';

var path = require('path');

var gulp = require('gulp');
var RevAll = require('gulp-rev-all');
var async = require('async');

var args = require('../util/arg-parse');
var config = require('../../package.json');

//执行rev md5需要依赖所有的task
gulp.task('rev',['clean:rev','image:prod','css-common:prod','css:prod','browserify:prod'],function() {
    
    //如果命令没有加--md5则不执行rev操作
    if(!args.md5) {
        return;
    }
    
    async.series([
        //执行js,css rev到相应路径
        function() {
            var revAll = new RevAll({
                dontRenameFile: ['images/'],
                fileNameManifest:'asset-manifest.json'
            });
            gulp.src([config.path.cssMin + '*.+(css|map)',config.path.jsMin + '*.+(js|map)'])
                .pipe(revAll.revision())
                .pipe(gulp.dest(config.path.min))
                .pipe(revAll.manifestFile())
                .pipe(gulp.dest(config.path.min));
        }
    ],
    function(err) {
        console.info(err);
    });
    
    return gulp;
    
});
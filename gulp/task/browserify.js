'use strict';

var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var factor = require('factor-bundle');
var concat = require('gulp-concat');
var concatStream = require('concat-stream');
var file = require('gulp-file');
var buffer = require('vinyl-buffer');
var transform = require('vinyl-transform');
var sourcemaps = require('gulp-sourcemaps');
var async = require('async');
var babelify = require('babelify');

var config = require('../../package.json');
var args = require('../util/arg-parse');
var onlyScripts = require('../util/script-filter');


//所有页面级的js  dev/js/pages

//dev task
gulp.task('browserify', function () {

    var pageScripts = fs.readdirSync(path.join(config.publicPath.jsDev, ( args.admin ? 'admin/pages' : 'default/pages' ) )).filter(onlyScripts);

    var b = browserify({
        cache: {},
        packageCache: {},
        fullPaths: false,
        entries: [path.resolve(config.publicPath.jsDev, ( args.admin ? 'admin/common/main.js' : 'default/common/main.js' ) )],  //入口为/default/common/main.js
        debug: true  //开启sourcemaps
    }).transform(babelify,{
        compact: false,
        presets:['es2015'],
        only: (args.admin ? /\/public\/dev\/js\/admin\// : /\/public\/dev\/js\/default\//)
    });

    var w = watchify(b);

    //遍历dev/js/pages/*.js (!main.js) 
    //使用browserify的require() ，可以将page文件，在页面中require
    pageScripts.forEach(function(page) {
        if(page !== 'main.js') {
            w.require(path.resolve(config.publicPath.jsDev, ( args.admin ? 'admin/pages' : 'default/pages' ) ,page),{expose:page.replace(/\.js$/,'')});
        }
    });

    //dev环境只生成一个bunddle.js,并带sourcemap
    var bundle = function () {
        w.bundle()
            .pipe(source(config.name + ( args.admin ? '.admin.bundle.js' : '.default.bundle.js' )))
            .pipe(gulp.dest(path.resolve(config.publicPath.jsDist)));
        return w;
    };

    w.on('update', bundle);
    w.on('log', gutil.log);
    return bundle();

});



//prod task
//prod环境流程，利用factor-bundle首先生成external.js, common.js, pages.js ，这样可以更高利用缓存率
//为了减少请求书，再把common.js和pages.js进行合并，生成main.js

//dev
gulp.task('browserify-admin:prod', function () {
    return jsProdTask('admin');
});

gulp.task('browserify-default:prod', function () {
    return jsProdTask('default');
});


function jsProdTask(view) {

    var pageScripts = fs.readdirSync(path.join(config.publicPath.jsDev, view + '/pages')).filter(onlyScripts);

    //factor-bundle增加common/main.js和pages/main.js
    var b = browserify({
        entries: [path.resolve(config.publicPath.jsDev,view + '/common/main.js'),path.resolve(config.publicPath.jsDev, view + '/pages/main.js')],
        debug: true
    }).transform(babelify,{
        compact: false,
        presets:['es2015'],
        only:/\/public\/dev\/js\//
    });

    var bundle = function () {

        //将pages下的js 增加require到页面
        pageScripts.forEach(function(page) {
            if(page !== 'main.js') {
                b.require(path.resolve(config.publicPath.jsDev,view + '/pages/',page), {expose:page.replace(/\.js$/,'')});
            }
        });

        //使用factor-bundle,生成3个js
        b.plugin('factor-bundle', {
                e:[path.resolve(config.publicPath.jsDev,view + '/common/main.js'),path.resolve(config.publicPath.jsDev,view + '/pages/main.js')],
                o:[write(config.name + '.' + view + '-common.js'), write(config.name + '.' + view + '-pages.js')]})
            .bundle()
            .pipe(write(config.name + '.' + view + '.external.js'));

        return b;

    };


    function write(filepath) {
        return concatStream(function (content) {

            async.series([

                function(cb) {

                    //生成单个js文件，增加sourcemaps,压缩js
                    file(path.basename(filepath), content, {src: true})
                        .pipe(buffer())
                        .pipe(uglify())
                        .pipe(gulp.dest(path.resolve(config.publicPath.jsMin)))
                        .on('end',function() {
                            cb();
                        })
                },

                function(cb) {
                    //如果处理的文件是name.external.js就表示最后一个js，此时合并common.js和page.js为main.js
                    if(filepath === (config.name + '.' + view + '.external.js')) {
                        gulp.src([config.publicPath.jsMin + config.name + '.' + view + '-common.js',config.publicPath.jsMin + config.name + '.' + view + '-pages.js'])
                            .pipe(concat(config.name + '.' + view + '.js'))
                            .pipe(gulp.dest(config.publicPath.jsMin))
                            .on('end',cb);
                    }
                },

                function() {
                    //合并完之后，将common.js和pages.js删除
                    var unlinkArr = ['.' + view + '-common.js','.' + view + '-pages.js'];
                    for(var i=0;i<unlinkArr.length;i++) {
                        fs.unlinkSync(config.publicPath.jsMin + config.name + unlinkArr[i]);
                    }
                }

            ],function(err) {
                console.info(err);
            });

        });
    }

    return bundle();

}
 
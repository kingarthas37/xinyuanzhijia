'use strict';

let webshot = require('webshot');
let Array = require('node-array');
let async = require('async');
let extend = require('xtend');

let AV = require('leanengine');



module.exports = function(params,callback,error) {
    
    let promise = new AV.Promise();

    let name = params.name;
    let html = params.html;
    let htmlHeight = params.htmlHeight;
    let segmentHeight = params.segmentHeight;
console.log(params);
    let segments = new Array(Math.ceil(htmlHeight / segmentHeight));
    html = html.replace(/https/g,'http');

    //淘宝发布的Mobile尺寸最大高度为960，故需要分段
    let options = {
        siteType: 'html',
        shotSize: {
            width: 750,
            height: segmentHeight
        },
        quality:75 //渲染质量,默认值75
    };

    let index = 0;

    async.forEachSeries(segments,(segment,cb) => {

        let option = extend(options, {
            shotOffset: {
                left: 0,
                right: 0,
                top: index * segmentHeight,
                bottom: 0
            }
        });

        if (htmlHeight % segmentHeight !==0 && index === segments.length - 1) {
            option.shotSize.height = htmlHeight % segmentHeight;
        }
     //   let fileName = name.replace(/\s/g,'').substr(0,20);
       // let indexLen = index < 9 ? 0 : '';
      //  for(var start = +new Date; + new Date - start <= 1; ) { }        //休眠1秒
        console.log(index+1);
        webshot(html,`shot/${index + 1}-shot.jpg`, option, function (err) {
            if(err) {
                console.info(err);
                return false;
            }
            index ++;
            cb();
        });

    },()=> {
        promise.resolve();
    });

    return promise;
    
};
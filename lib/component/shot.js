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
    const SEGMENT_HEIGHT = 960;

    let segments = new Array(Math.ceil(htmlHeight / SEGMENT_HEIGHT));
    
    html += "<style>body { margin:0; width:750px; font-size:22px; font-weight: 100; line-height:38px; background: #fff; font-family:'Segoe UI','Lucida Grande','Helvetica','Arial','Microsoft YaHei'; } section {  padding:0; margin:0 0 20px 0; } div { padding:0 15px; margin-bottom: 20px;  } ul {  margin:0 0 15px 0; padding: 0 0 0 20px; } img { width: 100%; } p { margin:0 0 15px 0; padding: 0; } </style>";

    html = html.replace(/https/g,'http');
    
    //淘宝发布的Mobile尺寸最大高度为960，故需要分段
    let options = {
        siteType: 'html',
        shotSize: {
            width: 750,
            height: SEGMENT_HEIGHT
        },
        quality:80 //渲染质量,默认值75
    };

    let index = 0;
    async.forEachSeries(segments,(segment,cb) => {
        
        let option = extend(options, {
            shotOffset: {
                left: 0,
                right: 0,
                top: index * SEGMENT_HEIGHT,
                bottom: 0
            }
        });

        if (index === segments.length - 1) {
            option.shotSize.height = htmlHeight % SEGMENT_HEIGHT;
        }

        webshot(html, `shot/${name.substr(0,20)}_${index + 1}.jpg`, option, function (err) {
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
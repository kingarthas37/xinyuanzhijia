'use strict';

let leanAppHeader = window.leanAppHeader;
let utils = require('../common/utils');

module.exports = {

    indexFun:function() {

    },

    //上传主展示图片callback
    uploadFileSuccess:function(data) {
        let imageView = $('.image-list');
        $.each(data,(i,n)=> {
            imageView.append(`<li data-id="${n.id}" class="am-cf"><div class="am-fl"><input type="checkbox" /></div><div class="am-fr"><p><a class="img-link" href="${n.url}" target="_blank"><img src="${n.url}?imageMogr2/thumbnail/100"/></a></p><p><a class="move" href="javascript:;">前移</a> | <span class="copy"><a class="copy-url" href="javascript:;">复制</a></span> | <a class="remove" href="javascript:;">删除</a></p></div></li>`);
        });
        this.updateImage();
    },

    //更新image list
    updateImage:function() {

        let image = $('#image');
        let imageView = $('.image-list');
        let value = {};

        imageView.find('input[type=checkbox]').each(function() {
            let content = $(this).parents('li');
            value[content.data('id')] = {
                "url":content.find('.img-link').attr('href'),
            };
        });
        image.val(JSON.stringify(value));

        this.setZclip();
    },

    //上传主展示图片callback
    uploadVideoFileSuccess:function(data) {
        let videoFile = $('.video-link');
        $.each(data,(i,n)=> {
            videoFile.val(n.url);
        });
        this.updateFile();
    }

};
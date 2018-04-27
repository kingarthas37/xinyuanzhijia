'use strict';

let leanAppHeader = window.leanAppHeader;
let utils = require('../common/utils');

module.exports = {

    indexFun:function() {
        //删除product
        {
            let alert = $('#modal-alert');
            $('.remove-article').click(function() {
                $('#confirm-remove-article').modal({
                    relatedTarget: this,
                    onConfirm: function() {

                        let target = $(this.relatedTarget);
                        let articleId = target.attr('data-id');
                        $.ajax({
                            type:'post',
                            url:`/admin/article/remove/${articleId}`
                        }).then(()=> {
                            alert.modal({
                                relatedTarget: this,
                                onConfirm:()=> {
                                    let target = $(this.relatedTarget);
                                    target.parents('tr').detach();
                                }
                            }).find('.am-modal-bd').text('删除文章成功!');
                        });
                    },
                    onCancel:()=> { return false; }
                });

                return false;

            });
        }
    },

    addFun:function () {
        $('.am-form').validator({});
        $('#name')[0].focus();
    },
    editFun:function () {
        $('.am-form').validator({});
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
            console.log(content);
            console.log(content.find('.img-link').attr('href'));
            value = content.find('.img-link').attr('href')
        });
        image.val(value);
    },

    //上传主展示图片callback
    uploadVideoFileSuccess:function(data) {
        let videoFile = $('#video-link');
        console.log(data);
        $.each(data,(i,n)=> {
            videoFile.val(n.url);
        });
    }

};
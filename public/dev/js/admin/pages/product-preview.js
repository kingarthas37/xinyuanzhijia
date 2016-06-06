'use strict';

//产品预览 function
module.exports = function() {

    let previewContent = $('.preview-content');

    let html = $.trim(previewContent.html());
    
    let btnCopy = $('.btn-copy');
    btnCopy.zclip({
        path: '/assets/swf/ZeroClipboard.swf',
        copy: function () {
            return html;
        },
        afterCopy: function () {
            btnCopy.popover({
                content: '复制成功!'
            });
        }
    });

    let btnShot = $('.btn-shot');
    btnShot.button('loading');
    let progress = $.AMUI.progress;

    window.onload = function() {

        btnShot.button('reset');
        btnShot.click(function() {

            progress.start();
            btnShot.button('loading').text('图片生成中...');
            $.ajax({
                url:'/admin/product/preview/shot',
                type:'post',
                data:{
                    html:html,
                    htmlHeight:previewContent.height(),
                    name:$('h4').text()
                },
                success:function() {
                    progress.done();
                    $('#modal-shot-success').modal();
                    btnShot.button('reset').text('生成淘宝详情图片');
                }
            });
        });

    };

};
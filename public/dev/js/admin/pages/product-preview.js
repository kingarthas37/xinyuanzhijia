'use strict';

//产品预览 function
module.exports = {
    init(settings) {
        this.settings = settings;
        this.btnCopy();
        this.waterMark();
        this.screenShot();
    },
    btnCopy() {
        let previewContent = $('.preview-content');
        let html = $.trim(previewContent.html());
        let btnCopy = $('.btn-copy');
        
        let clipboard = new Clipboard(btnCopy[0], {
            text: function() {
                return html;
            }
        });
        
        clipboard.on('success',data => {
            btnCopy.popover({
                content: '复制成功!'
            });
        });
        
    },
    waterMark() {
        
        let images = $('.preview-content').find('div img');
        
        images.each(function() {
            let src = this.src;
            $(this).data('src-source',src.replace(/\?.+/,''));
            $(this).data('src-target',src);
        });
        
        $('.disable-watermark').click(function() {
            if(this.checked) {
                images.each(function() {
                    $(this).attr('src',$(this).data('src-source'));
                });
            } else {
                images.each(function() {
                    $(this).attr('src',$(this).data('src-target'));
                });
            }
        });
        
    },
    screenShot() {
        
        let previewContent = $('.preview-content');
        let html = $.trim(previewContent.html());
        
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
                        name:$('h4').text().replace(/\//g,'')
                    },
                    success:function() {
                        progress.done();
                        $('#modal-shot-success').modal();
                        btnShot.button('reset').text('生成淘宝详情图片');
                    }
                });
            });

        };
    }
};
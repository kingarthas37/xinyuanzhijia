'use strict';

let leanAppHeader = window.leanAppHeader;
let utils = require('../common/utils');

module.exports = {

    indexFun:function() {
        //删除product
        {
            let alert = $('#modal-alert');
            let search = $('input[name=search]').val();
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
            $('#articleCategory').change(function() {
                if(this.value) {
                    return location.href = utils.urlParamsComponent('/admin/article',{
                        search,
                        'article-category-id': this.value
                    });
                }
                location.href = utils.urlParamsComponent('/admin/article',{
                    search,
                    'article-category-id': this.value
                });
            });
        }

        //预览
        {
            let modal = $('#modal-preview');

            $('.btn-preview').click(function () {
                let iframe = $('#iframe-article');
                let articleId = parseInt($(this).data('id'));
                modal.modal();
                iframe[0].src = `/admin/article/preview/${articleId}`;
            });

            modal.on('closed.modal.amui', function() {
                $(this).removeData('amui.modal');
                modal.find('iframe').detach();
                modal.find('.article-content').html(`<iframe id="iframe-article" src="" frameborder="0"></iframe>`);
            });
        }

    },

    addFun:function () {
        this.domEvent();
        $('#name')[0].focus();
    },
    editFun:function () {
        this.domEvent();
    },
    domEvent() {

        $('.am-form').validator({});

        //主图片上传dom
        {
            let image = $('#image');
            let imageView =  $('.main-image-view');
            image.change(function () {
                imageView.html(`<a href="${image.val()}" target="_blank"><img src="${image.val()}?imageMogr2/thumbnail/100" width="100" /></a>`);
            });
        }

        //视频上传dom
        {
            let video = $('#video-link');
            let videoView =  $('.video-view');
            /*
            video.change(function () {
                videoView.html(`
                    <video width="100" height="100" controls>
                        <source src="${video.val()}" type="video/mp4">
                    </video>
                `);
            });
            */
        }

    }


};
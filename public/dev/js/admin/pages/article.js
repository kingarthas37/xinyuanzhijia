'use strict';

let leanAppHeader = window.leanAppHeader;
let utils = require('../common/utils');

module.exports = {

    indexFun:function() {

        //分类select
        {
            let search = $('input[name=search]').val();
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

        //删除product
        {
            let alert = $('#modal-alert');
            $('.am-table').on('click','.remove-article',function () {
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

        //预览
        {

            let modal = $('#modal-preview');

            $('.am-table').on('click','.btn-preview',function () {
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

        //获取子文章
        {
            $('.article-title').each(function(i,n){
                let id = $(n).data('id');
                let tr = $(n).parents('tr');
                $.ajax({
                    url:`/admin/article/seed/${id}`,
                    success:function (data) {
                        if(!data.list.count) {
                            return false;
                        }
                        $.each(data.list.article,function (i, n) {

                            let image = (()=>{
                                 if(n.image) {
                                     return `<a href="${n.image}" target="_blank"><img width="40" src="${n.image}?imageMogr2/thumbnail/40" alt="" data-am-popover="{content:'<img width=150 src=${n.image}?imageMogr2/thumbnail/150>', trigger:'hover focus'}"></a>`;
                                 }
                                return `<img width="40" src="//lc-quipuwpj.cn-n1.lcfile.com/23726f840c784a3ede12.jpg?imageMogr2/thumbnail/40" alt="">`;
                            })();

                            let weiboUrl = (()=> {
                                return n.weiBoLink ? `<a target="_blank" href="${n.weiBoLink}"><i class="am-icon-link"></i></a>` : '-';
                            })();

                            let originalUrl = (()=>{
                                return n.originalLink ? `<a target="_blank" href="${n.originalLink}"><i class="am-icon-link"></i></a>` : '-';
                            })();

                            let taoBaoUrl = (()=>{
                                return n.taoBaoLink ? `<a target="_blank" href="${n.taoBaoLink}"><i class="am-icon-link"></i></a>` : '-';
                            })();

                            let videoLink = (()=>{
                                return n.videoLink ? `<a target="_blank" href="${n.videoLink}"><i class="am-icon-link"></i></a>` : '-';
                            })();

                            let suatus = (()=>{
                                return n.status ? '<strong>已发布</strong>' : '未发布';
                            })();

                              let date = new Date(n.updatedAt).getFullYear() + '-' + (new Date(n.updatedAt).getMonth()+1) + '-' + new Date(n.updatedAt).getDate();


                            tr.after(`
                                <tr class="child"> 
                                    <td colspan="2" class="child-title"> 
                                        ${image}
                                        <a href="/admin/article/edit/${n.articleId}">${n.name}</a> 
                                    
                                    </td>
                                    <td class="t-c">
                                        ${weiboUrl}
                                    </td>           
                                    <td class="t-c">
                                        ${originalUrl}
                                    </td>
                                    <td class="t-c">
                                        ${taoBaoUrl}
                                    </td>
                                    <td class="t-c">
                                        ${videoLink}
                                    </td>
                                    <td class="t-c">${suatus}</td>
                                    <td>
                                     <a href="javascript:;" target="_blank" data-id="${n.articleId}" class="btn-preview">预览</a>
                                     <a href="/admin/article/copy/${n.articleId}">复制</a>
                                     <a href="javascript:;" data-id="${n.articleId}" class="remove-article">删除</a>
                                    </td>
                                    <td class="t-c">
                                        ${date}
                                    </td>
                                </tr>
                            `);
                        });

                    }
                });
            });
        }

    },

    addFun:function () {
        this.domEvent();
        this.setDetailImageList();
        this.setAttachImageList();
        this.setZclip();
        $('#name')[0].focus();
    },
    editFun:function () {
        this.domEvent();
        this.setZclip();
        this.setDetailImageList();
        this.setAttachImageList();
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

        //主图片weitao上传dom
        {
            let image = $('#image-weitao');
            let imageView =  $('.main-image-weitao-view');
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


        //编辑markdown换行
        {

            $('.btn-replace-br').click(function () {
               let target = $($(this).attr('data-target'));
               let text = target.val();
               let _this = this;
               text = text.replace(/(.)\n/gi,'$1  \n');
               target.val(text);
               $(this).parent().find('label').text('自动替换换行设置完成!');
            });

        }

        //取消自动换行
        {
            $('.btn-replace-br-cancel').click(function () {
                let target = $($(this).attr('data-target'));
                let text = target.val();
                let _this = this;
                text = text.replace(/(.)  \n/gi,'$1\n');
                target.val(text);
                $(this).parent().find('label').text('取消自动替换换行设置完成!');
            });
        }

        //全屏编辑
        {

            $('.btn-edit-fullscreen').click(function () {
                let _this = this;
                let target = $($(this).attr('data-target'));
                let modal = $('#modal-detail-fullscreen');
                let textarea = modal.find('.textarea-detail-fullscreen');
                textarea.val(target.val());
                modal.modal({
                    relatedTarget: this,
                    width:$(window).width() - 100,
                    onConfirm: function(options) {
                        target.val(textarea.val());
                        $(_this).parent().find('label').text('编辑完成!');
                    },
                    onCancel: function() {
                    }
                });


            });

        }

    },

    uploadDetailImageSuccess(data) {
        let imageView = $('.group-detail-image .image-list');
        $.each(data,(i,n)=> {
            imageView.append(`<li data-id="${n.id}" class="am-cf"><div class="am-fl"><input type="checkbox" /></div><div class="am-fr"><p><a class="img-link" href="${n.url}" target="_blank"><img src="${n.url}?imageMogr2/thumbnail/100"/></a></p><p><a class="move" href="javascript:;">前移</a> | <span class="copy"><a class="copy-url" href="javascript:;">复制</a></span> | <a class="remove" href="javascript:;">删除</a></p></div></li>`);
        });
        this.updateDetailImage();
    },

    uploadAttachImagesSuccess(data) {
        let imageView = $('.group-attach-image .image-list');
        $.each(data,(i,n)=> {
            imageView.append(`<li data-id="${n.id}" class="am-cf"><div class="am-fl"><input type="checkbox" /></div><div class="am-fr"><p><a class="img-link" href="${n.url}" target="_blank"><img src="${n.url}?imageMogr2/thumbnail/100"/></a></p><p><a class="move" href="javascript:;">前移</a> | <a class="remove" href="javascript:;">删除</a></p></div></li>`);
        });
        this.updateAttachImage();
    },
    
    //更新image list
    updateDetailImage:function() {

        let input = $('#detail-images');
        let imageView = $('.group-detail-image .image-list');
        let value = '';

        imageView.find('input[type=checkbox]').each(function(i,n) {
            let content = $(this).parents('li');
            value += content.find('.img-link').attr('href') + ',';
        });
        value = value.substr(0,value.length-1);
        input.val(value);

        this.setZclip();

    },

    //更新image list
    updateAttachImage:function() {

        let input = $('#attach-images');
        let imageView = $('.group-attach-image .image-list');
        let value = '';

        imageView.find('input[type=checkbox]').each(function(i,n) {
            let content = $(this).parents('li');
            value += content.find('.img-link').attr('href') + ',';
        });
        value = value.substr(0,value.length-1);
        input.val(value);

    },

    setZclip:function() {
        let detailImage = $('#content');
        let imageView = $('.image-list');
        $('.zclip').detach();
        imageView.find('.copy-url').detach();

        imageView.find('.copy').append('<a class="copy-url" href="javascript:;">复制</a>');
        imageView.find('.copy-url').each(function() {
            let $this = $(this);
            let clipboard = new Clipboard(this, {
                text: function() {
                    return `![](${$this.parents('li').find('.img-link').attr('href')})`;
                }
            });
            clipboard.on('success',data => {
                imageView.find('.oncopy').removeClass('oncopy');
                $(this).addClass('oncopy');
            });
        });
    },

    setDetailImageList:function() {

        let _this = this;
        let imageView = $('.group-detail-image .image-list');
        let detailImage = $('#content');

        imageView.on('click','.move',function() {
            let content = $(this).parents('li');
            if(content.index() === 0) {
                return false;
            }
            content.after(content.prev());
            _this.updateDetailImage();
        });

        imageView.on('click','.remove',function() {
            let content = $(this).parents('li');

            //自动删除文本框中图片链接
            let imageSrc = content.find('img').attr('src');
            imageSrc = imageSrc.replace('?imageMogr2/thumbnail/100','');
            imageSrc = `![](${imageSrc})`;
            let val = detailImage.val().replace(imageSrc,'');
            detailImage.val($.trim(val));

            content.detach();
            _this.updateDetailImage();

        });

    },

    setAttachImageList:function () {

        let _this = this;
        let imageView = $('.group-attach-image .image-list');
        let detailImage = $('#content');

        imageView.on('click','.move',function() {
            let content = $(this).parents('li');
            if(content.index() === 0) {
                return false;
            }
            content.after(content.prev());
            _this.updateAttachImage();
        });

        imageView.on('click','.remove',function() {
            let content = $(this).parents('li');

            //自动删除文本框中图片链接
            let imageSrc = content.find('img').attr('src');
            imageSrc = imageSrc.replace('?imageMogr2/thumbnail/100','');
            imageSrc = `![](${imageSrc})`;
            let val = detailImage.val().replace(imageSrc,'');
            detailImage.val($.trim(val));

            content.detach();
            _this.updateAttachImage();

        });

    }


};
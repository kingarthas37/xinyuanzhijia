'use strict';

let leanAppHeader = window.leanAppHeader;
let swfobject = require('swfobject');
let FlashDetect = require('flash-detect');

module.exports = {

    indexFun:function() {

        let category1 = $('.select-category-1');
        let category2 = $('.select-category-2');
        let alert = $('#modal-alert');

        category1.change(function() {
            if(this.value > 0 ) {
                return location.href = `/admin/product?category1Id=${this.value}`;
            } 
            location.href = '/admin/product';
        });

        category2.change(function() {
            let category1Id = category1.val();
            if(this.value > 0 ) {
                return location.href = `/admin/product?category1Id=${category1Id}&category2Id=${this.value}`;
            }
            location.href = `/admin/product?category1Id=${category1Id}`;
        });
        
        $('.remove-product').click(function() {
            
            $('#confirm-remove-product').modal({
                relatedTarget: this,
                onConfirm: function() {
                    
                    let target = $(this.relatedTarget);
                    let productId = target.attr('data-id');
                    
                    $.get({
                        url:leanApp.api + 'classes/Product',
                        headers:leanAppHeader,
                        data:`where={"productId":${productId}}`
                    }).done(data => {
                        return $.get({
                            type:'delete',
                            url: leanApp.api + 'classes/Product/' + data.results[0].objectId,
                            headers: leanAppHeader
                        });
                    }).done(() => {
                        alert.modal({
                            relatedTarget: this,
                            onConfirm:()=> {
                                let target = $(this.relatedTarget);
                                target.parents('tr').detach()
                            }
                        }).find('.am-modal-bd').text('删除产品成功!');
                    });
                },
                onCancel:()=> { return false; }
            });
            
            return false;
            
        });

    },

    addFun:function() {
        
        this.setCategory();
        this.chooseBanner();
        this.submitControl();
        this.setImageList();

    },
    editFun:function() {
        
        this.setCategory();
        this.chooseBanner();
        this.submitControl();
        this.setImageList();
        this.setZclip();
    },
    
    //一级,二级分类选择
    setCategory:function() {
      
        let $select1 = $('#select-category-1');
        let $select2 = $('#select-category-2');
        let submit = $('#submit');
        
        $select1.change(function() {
            if(submit.data('state')) {
                return false;
            }
            let category1Id = this.value;
            $select2.find('option').detach();
            $.get({
                url:leanApp.api + 'classes/ProductCategory2',
                headers:leanAppHeader,
                data:'where={"category1Id":'+ category1Id +'}'
            }).done(data => {
                let options = ``;
                $.each(data.results,(i,n)=>{
                    options += `<option value="${n.category2Id}">${n.name}</option>`;
                });
                $select2.append(options);
            });
            return false;
        });
        
        $select2.change(function() {
            return false;
        });
        
    },
    
    //选择banner
    chooseBanner:function() {

        var select = $('#select-banner');
        var bannerView = $('.banner-view');
        select.on('change',function() {
            
            if(!this.value) {
                bannerView.addClass('hide');
                return false;
            }

            bannerView.removeClass('hide');
            bannerView.html(`<img width="400" src="${select.find('option:selected').attr('data-src')}"/>`);
        });
        
    },
    //设置主图预览
    setImageList:function() {

        let _this = this;
        let imageView = $('.image-list');
        
        imageView.on('click','.move',function() {
            let content = $(this).parents('li');
            if(content.index() === 0) {
                return false;
            }
            content.after(content.prev());
            _this.updateMainImage();
        });

        imageView.on('click','.remove',function() {
            let content = $(this).parents('li');
            $.ajax({
                type:'DELETE',
                url:leanApp.api + 'files/' + content.data('id'),
                headers:leanAppHeader
            }).done(() => {
                content.detach();
                _this.updateMainImage();
            });
        });

        imageView.on('click','input[type=checkbox]',function() {
            _this.updateMainImage();
        });
        
    },

 
    
    //提交时状态设置
    submitControl:function() {
        
        let submit = $('#submit');

        $('form :submit').click(function() {
            $('form').attr({
                'action':$(this).data('action'),
                'target':$(this).data('target')
            });
            return true;
        });
        
        $('.am-form').validator({
            submit:function() {
                if(!this.isFormValid()){
                    return false;
                }
                submit.attr('disabled',true).addClass('am-disabled');
            }
        });
    },

    //上传主展示图片callback
    uploadFileSuccess:function(data) {
        let imageView = $('.image-list');
        $.each(data,(i,n)=> {
            imageView.append(`<li data-id="${n.id}" class="am-cf"><div class="am-fl"><input type="checkbox" /></div><div class="am-fr"><p><a href="${n.url}" target="_blank"><img src="${n.url}"/></a></p><p><a class="move" href="javascript:;">前移</a> | <span class="copy"><a class="copy-url" href="javascript:;">复制</a></span> | <a class="remove" href="javascript:;">删除</a></p></div></li>`);
        });
        this.updateMainImage();
    },

    //更新image list
    updateMainImage:function() {
        
        let image = $('#main-image');
        let imageView = $('.image-list');
        let value = {};
        
        imageView.find('input[type=checkbox]').each(function() {
            let content = $(this).parents('li');
            value[ content.data('id') ] = {
                "url":content.find('img').attr('src'),
                "isMainImage":this.checked
            };
        });
        image.val(JSON.stringify(value));
        
        this.setZclip();
        
    },
    
    setZclip:function() {
        if (FlashDetect.installed) {
            let imageView = $('.image-list');
            //删除swf绑定的dom,重设swf
            $('.zclip').detach();
            imageView.find('.copy-url').detach();

            imageView.find('.copy').append('<a class="copy-url" href="javascript:;">复制</a>');
            imageView.find('.copy-url').each(function() {
                $(this).zclip({
                    path: '/swf/ZeroClipboard.swf',
                    copy: function () {
                        return $(this).parents('li').find('img').attr('src');
                    },
                    afterCopy: function () {
                        imageView.find('.oncopy').removeClass('oncopy');
                        $(this).addClass('oncopy');
                    }
                });
            });
        }
    }

};
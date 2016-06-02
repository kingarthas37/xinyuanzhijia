'use strict';

let leanAppHeader = window.leanAppHeader;
let swfobject = require('swfobject');
let FlashDetect = require('flash-detect');

let listDataRequest = require('./product/list-data-request');

module.exports = {

    indexFun:function() {

        let category1 = $('.select-category-1');
        let category2 = $('.select-category-2');
        let productMethod = $('.select-product-method');
        
        let alert = $('#modal-alert');

        productMethod.change(function(){
            if(this.value) {
                return location.href = `/admin/product?product-method-id=${this.value}`;
            }
            location.href = '/admin/product';
        });

        category1.change(function() {
            let productMethodId = productMethod.val();
            if(this.value) {
                return location.href = `/admin/product?product-method-id=${productMethodId}&category1-id=${this.value}`;
            } 
            location.href = `/admin/product?product-method-id=${productMethodId}`;
        });

        category2.change(function() {
            let productMethodId = productMethod.val();
            let category1Id = category1.val();
            if(this.value) {
                return location.href = `/admin/product?product-method-id=${productMethodId}&category1-id=${category1Id}&category2-id=${this.value}`;
            }
            location.href = `/admin/product?product-method-id=${productMethodId}&category1-id=${category1Id}`;
        });
        
        $('.remove-product').click(function() {
            $('#confirm-remove-product').modal({
                relatedTarget: this,
                onConfirm: function() {
                    
                    let target = $(this.relatedTarget);
                    let productId = target.attr('data-id');
                    
                    $.ajax({
                        type:'post',
                        url:`/admin/product/remove/${productId}`
                    }).then(()=> {
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

        //列表首页ajax加载product-property数据
        listDataRequest.init();

    },

    addFun:function() {
        
        this.setCategory();
        this.chooseBanner();
        this.submitControl();
        this.setImageList();
        this.setZclip();

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
        
        let categoryGroup = $('.category-group');
        let $btnAddCategory = $('.btn-add-category');
        let _this = this;
        
        categoryGroup.on('change','.select-product-method',function() {

            let $this = $(this);
            let group = $this.parents('.group');
            let $selectCategory1 = group.find('.select-category-1');
            let $selectCategory2 = group.find('.select-category-2');
            
            if(!this.value) {
                return false;
            }
            
            if(_this.isSubmitBtn) {
                return false;
            }
            
            let productMethodId = parseInt(this.value);

            $.get({
                url:`${leanApp.api}classes/ProductCategory1`,
                headers:leanAppHeader,
                data:`where={"productMethodId":${productMethodId}}`
            }).done(data => {
                $selectCategory1.find('option:not(:first)').detach();
                $selectCategory2.find('option:not(:first)').detach();
                let options = ``;
                $.each(data.results,(i,n)=>{
                    options += `<option value="${n.category1Id}">${n.name}</option>`;
                });
                $selectCategory1.append(options);
            });
            
        });

        categoryGroup.on('change','.select-category-1',function() {
            
            let group = $(this).parents('.group');
            let $selectCategory2 = group.find('.select-category-2');

            if(!this.value){
                return false;
            }


            if(_this.isSubmitBtn) {
                return false;
            }
            
            let category1Id = parseInt(this.value);
            
            $.get({
                url:leanApp.api + 'classes/ProductCategory2',
                headers:leanAppHeader,
                data:'where={"category1Id":'+ category1Id +'}'
            }).done(data => {
                $selectCategory2.find('option:not(:first)').detach();
                let options = ``;
                $.each(data.results,(i,n)=>{
                    options += `<option value="${n.category2Id}">${n.name}</option>`;
                });
                $selectCategory2.append(options);
            });
        });

        categoryGroup.on('click','.btn-remove-category',function() {
            $(this).parents('.group').detach();
        });
        
        //添加新category group并初始化
        $btnAddCategory.click(function() {
            let group = $(this).parents('.group');
            let newGroup = group.clone();
            newGroup.find('.am-selected').detach();
            newGroup.find('select').removeAttr('data-am-selected').removeAttr('required');
            newGroup.appendTo(categoryGroup);
            newGroup.find('.select-category-1 option:not(:first)').detach();
            newGroup.find('.select-category-2 option:not(:first)').detach();
            newGroup.find('.btn-add-category').removeClass('btn-add-category').addClass('btn-remove-category').text('删除');
            newGroup.find('label').detach();
            newGroup.find('select').amuiSelected();
        });
        
    },
    
    //选择banner
    chooseBanner:function() {

        let select = $('#select-banner');
        let bannerView = $('.banner-view');
        let banner = $('#banner');
        
        select.on('change',function() {
            let src = select.find('option:selected').attr('data-src');
            bannerView.removeClass('hide');
            bannerView.html(`<img width="400" src="${src}"/>`);
            banner.val(src);
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
        let _this = this;
        _this.isSubmitBtn =false;
        
        $('form :submit').click(function() {
            
            let $this = $(this);
            _this.isSubmitBtn = true;
            
            $('form').attr({
                'action':$this.data('action'),
                'target':$this.data('target')
            });

            if(this.id === 'submit') {
                $this.data('state',$this[0].id);
            }
            
            //由于submit时amazeui的select会触发一次onchange,导致category1和category2会重置,数据丢失
            //还原isSubmitBtn,让select enable
            setTimeout(function() {
                _this.isSubmitBtn = false;
                if(this.id === 'submit') {
                    $this.data('state',false);
                }
            }.bind(this),1000);
            return true;
        });
        
        
        $('.am-form').validator({
            submit:function() {
                if(!this.isFormValid()){
                    return false;
                }
                if(submit.data('state') === 'submit') {
                    submit.attr('disabled',true).addClass('am-disabled');
                }
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
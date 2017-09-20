'use strict';

let leanAppHeader = window.leanAppHeader;
let utils = require('../common/utils');

module.exports = {

    indexFun:function() {
        //选择产品分类
        {
            let category1 = $('.select-category-1');
            let category2 = $('.select-category-2');
            let productMethod = $('.select-product-method');
            let onsale = $('input[name=onsale]');
            
            let category1Val = category1.val();
            let category2Val = category2.val();
            let productMethodVal = productMethod.val();
            let onsaleVal = onsale.val();

            productMethod.change(function(){
                if(this.value) {
                    return location.href = utils.urlParamsComponent('/admin/product',{
                        'product-method-id':this.value,
                        'onsale':onsaleVal
                    });
                }
                location.href = utils.urlParamsComponent('/admin/product',{
                    'onsale':onsaleVal
                });
            });

            category1.change(function() {
                if(this.value) {
                    return location.href = utils.urlParamsComponent('/admin/product',{
                        'product-method-id':productMethodVal,
                        'category1-id':this.value,
                        'onsale':onsaleVal
                    });
                }
                location.href = utils.urlParamsComponent('/admin/product',{
                    'product-method-id':productMethodVal,
                    'onsale':onsaleVal
                });
            });

            category2.change(function() {
                if(this.value) {
                    return location.href = utils.urlParamsComponent('/admin/product',{
                        'product-method-id':productMethodVal,
                        'category1-id':category1Val,
                        'category2-id':this.value,
                        'onsale':onsaleVal
                    });
                }
                location.href = utils.urlParamsComponent('/admin/product',{
                    'product-method-id':productMethodVal,
                    'category1-id':category1Val,
                    'onsale':onsaleVal
                });
            });


            onsale.change(function() {
                location.href = utils.urlParamsComponent('/admin/product',{
                    'product-method-id':productMethodVal,
                    'category1-id':category1Val,
                    'category2-id':category2Val,
                    'onsale':this.value
                });
            });
            
        }
        
       
        
        //删除product
        {
            let alert = $('#modal-alert');
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
                                    target.parents('tr').detach();
                                }
                            }).find('.am-modal-bd').text('删除产品成功!');
                        });
                    },
                    onCancel:()=> { return false; }
                });

                return false;

            });
        }

        {
            $('.am-table').on('click','.am-icon-link',function() {
                $(this).addClass('on');
            });
        }
        
        //编辑定位
        {
            if(/product-id=\d+/.test(location.search)) {
                let editProductId = /product-id=(\d+)/.exec(location.search)[1];
                let item = $(`tr[data-product-id=${editProductId}]`);
                item.addClass('on');
                $('html,body').animate({'scrollTop':item.offset().top});
            }
        }
        
        
        //modal viewport iframe
        {
            let modalViewport = $('#modal-viewport');
            let modalViewportContent = modalViewport.find('.am-modal-bd');
            
            $('.link-modal-viewport').click(function() {
                modalViewportContent.append('<iframe class="iframe-viewport" src="" frameborder="0"></iframe>');
                let iframe = modalViewport.find('iframe');
                let src = $(this).attr('href');
                iframe.attr('src',src);
                modalViewport.modal({
                    width:800,
                    height:520
                });
                return false;
            });

            modalViewport.on('close.modal.amui', function(){
                modalViewportContent.empty();
            });
        }
        
        
        //copy product content
        {
            let form = $('.form-copy-product-content');
            let modalConfirm = $('#modal-confirm');
            let modalAlert = $('#modal-alert');
            
            form.find('.am-btn').click(function() {
                
                let productId = parseInt($(this).parents('tr').data('product-id'));

                if(form.serialize() ==='') {
                    modalAlert.modal({
                        relatedTarget: this
                    }).find('.am-modal-bd').text('请选择需要复制的内容');
                    return false;
                }

                let data = [];
                form.find('input[type=checkbox]:checked').each(function() {
                    data.push(this.name);
                });
                
                modalConfirm.modal({
                    relatedTarget:this,
                    onConfirm: function() {
                        $.ajax({
                            url: '/admin/product/product-copy',
                            type: 'post',
                            data: {
                                productId: productId,
                                field: data
                            }
                        }).then(data => {
                            if(data.success) {
                                modalAlert.modal({
                                    relatedTarget: this,
                                    onConfirm: function() {
                                        location.reload();   
                                    }
                                }).find('.am-modal-bd').text('复制成功!');
                            }
                        });
                    }
                });
                
            });
        }
        
        
        //copy etsy
        {
            
            let modal = $('#modal-copy-etsy');
            let input = $('.input-copy-etsy');
            let modalLoading = $('#modal-loading');
            
            
            $('.link-copy-etsy').click(function() {
                let productId = $(this).data('product-id');
                modalLoading.find('.am-modal-hd').text('正在导入...');
                console.info(productId);
                modal.modal({
                    relatedTarget: this,
                    onConfirm: function(e) {
                        
                        if(!$.trim(input.val()) || $.trim(input.val()).indexOf('etsy.com') ===-1) {
                            alert('请输入正确的etsy.com链接');
                            return;
                        }
                        
                        $.ajax({
                            url:'/admin/product/spider-info',
                            data:{
                                'product-id':productId,
                                'url':$.trim(input.val())
                            }
                        }).then(
                            result => {
                                if(result.code) {
                                    modalLoading.find('.am-modal-hd').text('导入成功!正在更新...');
                                    setTimeout(()=> {
                                        location.reload();
                                    },1000);
                                } else {
                                    modalLoading.find('.am-modal-hd').text('导入失败,请重试!');
                                    setTimeout(()=> {
                                        modalLoading.modal('close');
                                    },1000);
                                }
                            },
                            err => {
                                console.info(err);
                                modalLoading.find('.am-modal-hd').text('导入失败,请重试!');
                                setTimeout(()=> {
                                    modalLoading.modal('close');
                                },1000);
                            }
                        );
                        modalLoading.modal();
                        
                    }
                });
                input[0].focus();
                return false;
            });
            
        }
        
        
        //copy title
        {
            $('.copy-product-title').each(function(i,n) {
                let clipboard = new Clipboard(n, {
                    text: function() {
                        return `${$(n).data('text')} {${$(n).data('id')}}`;
                    }
                });
                clipboard.on('success',data => {
                    $(n).addClass('on');
                });
            });
        }
        
        
        {
            $('.image-source-download').click(function() {
                let group = $(this).next();
                let links = group.find('.image-source-value').val().split('\n');
                let id = $(this).data('product-id');
                if(links.length) {
                    $.each(links,function(i,n) {
                        group.append(`<a href="${n}" download>download</a>`);
                    });
                    group.find('a').each(function() {
                        let evObj = document.createEvent('MouseEvents');
                        evObj.initEvent('click', true, false);
                        this.dispatchEvent(evObj);
                    });
                }
            });  
        }
        
        {
            $('.set-onsale').click(function() {
                let isOnsale = $(this).attr('isonsale') === 'true' ? false : true;
                console.info(isOnsale);
                let productId = $(this).parents('tr').data('product-id');
                let title = $(this).parents('tr').find('.title');
                $.ajax({
                    type:'post',
                    url:`/admin/product/set-onsale/${productId}`,
                    data:{isOnsale}
                }).then(data => {
                    if(data.success) {
                        if(isOnsale) {
                            console.info(this);
                            title.removeClass('product-out');
                            $(this).attr('isonsale','true');
                        } else {
                            title.addClass('product-out');
                            $(this).attr('isonsale','false');
                        }
                    }
                });
                
            });
        }
        
    },

    addFun:function() {
        
        this.setCategory();
        this.chooseBanner('add');
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
            newGroup.find('select').removeAttr('required');
            newGroup.appendTo(categoryGroup);
            newGroup.find('.select-category-1 option:not(:first)').detach();
            newGroup.find('.select-category-2 option:not(:first)').detach();
            newGroup.find('.btn-add-category').removeClass('btn-add-category').addClass('btn-remove-category').text('删除');
            newGroup.find('label').detach();
        });
        
    },
    
    //选择banner
    chooseBanner:function(page) {

        let select = $('#select-banner');
        let bannerView = $('.banner-view');
        let banner = $('#banner');
        let selectBannerRandom = $('.select-banner-random');
        
        select.on('change',function() {
            let src = select.find('option:selected').attr('data-src');
            bannerView.removeClass('hide');
            bannerView.html(`<img width="300" src="${src}"/>`);
            banner.val(src);
        });

        selectBannerRandom.click(function() {
            let bannerRange = Math.floor(Math.random() * ( select.find('option').length -1 ));
            select.find('option').get(bannerRange).selected = true;
            select.trigger('change');
        });
        
        if(page==='add') {
            setTimeout(()=> {
                selectBannerRandom.click();
            },1000);
        }
        
    },
    //设置主图预览
    setImageList:function() {

        let _this = this;
        let imageView = $('.image-list');
        let detailImage = $('#detail-image');
        
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
            
            //自动删除文本框中图片链接
            let imageSrc = content.find('img').attr('src');
            imageSrc = imageSrc.replace('?imageMogr2/thumbnail/100','');
            imageSrc = `![](${imageSrc})`;
            let val = detailImage.val().replace(imageSrc,'');
            detailImage.val($.trim(val));
            
            content.detach();
            _this.updateMainImage();
           
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
            imageView.append(`<li data-id="${n.id}" class="am-cf"><div class="am-fl"><input type="checkbox" /></div><div class="am-fr"><p><a class="img-link" href="${n.url}" target="_blank"><img src="${n.url}?imageMogr2/thumbnail/100"/></a></p><p><a class="move" href="javascript:;">前移</a> | <span class="copy"><a class="copy-url" href="javascript:;">复制</a></span> | <a class="remove" href="javascript:;">删除</a></p></div></li>`);
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
            value[content.data('id')] = {
                "url":content.find('.img-link').attr('href'),
                "isMainImage":this.checked
            };
        });
        image.val(JSON.stringify(value));
        
        this.setZclip();
        
    },
    
    setZclip:function() {
            let detailImage = $('#detail-image');
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
                    let detailText = detailImage.val();
                    if(!$.trim(detailText)) {
                        detailImage.val(detailText + data.text);
                    } else {
                        detailImage.val(detailText + '\n' + data.text);
                    }
                });
            });
    }

};
'use strict';

let leanAppHeader = window.leanAppHeader;

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

            var $this = $(this);
            
            $('#confirm-remove-product').modal({
                relatedTarget: this,
                onConfirm: function() {
                    
                    let productId = $this.attr('data-id');
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
                            onConfirm:()=>$this.parents('tr').detach()
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
        this.setMainImage();
        this.submitControl();

    },
    editFun:function() {
        
        this.setCategory();
        this.chooseBanner();
        this.setMainImage();
        this.submitControl();
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
    setMainImage:function() {
        
        var mainImage = $('#main-image');
        var mainImageList = $('.main-image-list');

        mainImage.change(function() {
            mainImageList.empty();
            var arr = mainImage.val().split('\n');
            if($.trim(arr[0])==='') {
                return;
            }
            $.each(arr,function(i) {
                mainImageList.append('<li><a href="'+ arr[i] +'" target="_blank"><img src="' + arr[i] + '"/></a></li>');
            });
        });
        
    },
    
    //提交时状态设置
    submitControl:function() {
        let submit = $('#submit');
        $('.am-form').validator({
            submit:function() {
                if(!this.isFormValid()){
                    return false;
                }
                submit.attr('disabled',true).addClass('am-disabled');
            }
        });
    }

};
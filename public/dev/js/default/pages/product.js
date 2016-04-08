'use strict';

let leanAppHeader = window.leanAppHeader;

module.exports = {

    indexFun:function() {

        $('.select-category').change(function() {
            if(this.value > 0 ) {
                location.href = '/product?categoryId=' + this.value;
            }
        });

        $('.remove-product').click(function() {

            var $this = $(this);
            
            $('#confirm-remove-product').modal({
                relatedTarget: this,
                onConfirm: function(options) {
                    location.href = $this.attr('href');
                },
                onCancel: function() {
                    return false;
                }
            });
            
            return false;
            
        });

    },

    addFun:function() {
        
        this.setCategory();
        this.chooseBanner();
        this.setMainImage();

    },
    editFun:function() {
        
        this.setCategory();
        this.chooseBanner();
        this.setMainImage();
    },
    
    //分类选择
    setCategory:function() {
      
        let $select1 = $('#select-category-1');
        let $select2 = $('#select-category-2');
        
        $select1.change(function() {
            
            let category1Id = this.value;
            $select2.find('option').detach();
            
            $.get({
                url:leanApp.api + 'classes/ProductCategory2',
                headers:leanAppHeader,
                data:'where={"productCategory1Id":'+ category1Id +'}'
            }).done(data => {
                let options = ``;
                $.each(data.results,(i,n)=>{
                    options += `<option value="${n.productCategory2Id}">${n.name}</option>`;
                });
                $select2.append(options);
            });
            
            return false;
            
        });
        
    },
    
    //选择banner
    chooseBanner:function() {

        var select = $('#select-banner');
        var bannerLength = select.find('option').length - 1;
        var bannerView = $('.banner-view');
        var banner = $('#banner');
        
        var currentBannerSrc,
            currentBannerTitle;
        
        //如果是新增产品，默认为0
        if(parseInt(select.val()) === 0) {
            
            var count = Math.floor(Math.random(100) * bannerLength);
            currentBannerSrc = select.find('option:eq(' + count + ')').attr('data-src');
            currentBannerTitle = select.find('option:eq(' + count + ')').text();

            bannerView.html('<img width="400" src="'+ currentBannerSrc +'"/>');
            banner.val('!['+ currentBannerTitle +']('+ currentBannerSrc +')');
            
        //编辑产品
        } else {
            currentBannerSrc = select.find('option:selected').attr('data-src');
            currentBannerTitle = select.find('option:selected').text();

            bannerView.html('<img width="400" src="'+ currentBannerSrc +'"/>');
            banner.val('!['+ currentBannerTitle +']('+ currentBannerSrc +')');
        }
        
        select.on('change',function() {

            if(parseInt(this.value) === 0) {
                var count = Math.floor(Math.random(100) * bannerLength);
                currentBannerSrc = select.find('option:eq(' + count + ')').attr('data-src');
                currentBannerTitle = select.find('option:eq(' + count + ')').text();
            } else {
                currentBannerSrc = select.find('option[value='+ this.value +']').attr('data-src');
                currentBannerTitle = select.find('option[value='+ this.value +']').text();
            }
            bannerView.html('<img width="400" src="'+ currentBannerSrc +'"/>');
            banner.val('!['+ currentBannerTitle +']('+ currentBannerSrc +')');

        });
        
        $('.banner-enable').click(function() {
        
            if(this.checked) {
                banner.val('');
                bannerView.addClass('hide');
                banner.addClass('hide');
            } else {
                select.trigger('change');
                bannerView.removeClass('hide');
                banner.removeClass('hide');
            }
            
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
        
    }

};
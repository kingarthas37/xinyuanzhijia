'use strict';

let PhotoSwipe = require('photoswipe');
let PhotoSwipeUI_Default = require('photoswipe-ui');

module.exports = {

    detailFun() {

        //收藏
        this.favoriteProduct();

        $('.am-slider').flexslider({
            directionNav: false,
            slideshow:false
        });

        //图片预览
        {
            let _this = this;
            let detailImage = $('.detail-image');
            let detailImageLen = detailImage.find('img').length;
            let index = 0;
            detailImage.find('img').each(function (i, n) {
                n.onload = function () {
                    index++;
                    
                    let scale = $(n).width() / WIN_WIDTH;
                    
                    $(n).attr({
                        'swipe-width': WIN_WIDTH,
                        'swipe-height': $(n).height() / scale
                    });
                    if (index === detailImageLen) {
                        detailImage.find('img').each(function (i, n) {
                            $(n).click(function () {
                                _this.createPhotoSwipe(detailImage, i);
                            });
                        });
                    }
                };
            });

        }
        
        
        //自动设置property日期
        {
            $('#tab-product-param').find('em').each(function() {
                if($(this).text()=='date') {
                    let month = (new Date().getMonth() + 1) <= 2 ? 1 : 0;  //如果当前月份小于3月份则显示去年
                    $(this).text(new Date().getFullYear() - month + '年');
                }
            });
        }
        

    },

    favoriteProduct() {

        let favorite = $('#favorite');
        let favoriteText = $('.favorite-text');
        let favoriteCount = $('.favorite-count');

        favorite.click(function () {

            if (!window.isLogin) {
                location.href = `/user/login?return=${location.pathname}`;
                return false;
            }

            let productId = $(this).data('product-id');
            let count = parseInt(favoriteCount.text());

            if (this.checked) {

                $.ajax({
                    url: `/user/wish/add/${productId}`
                }).then(data => {

                    if (data.success) {
                        favoriteText.parent().addClass('active');
                        favoriteText.text('已收藏');
                        favoriteCount.text(count + 1);
                    }

                });

            } else {

                $.ajax({
                    url: `/user/wish/edit/${productId}`
                }).then(data => {

                    if (data.success) {
                        favoriteText.parent().removeClass('active');
                        favoriteText.text('收藏');
                        favoriteCount.text(count - 1);
                    }

                });

            }
        });

    },
    createPhotoSwipe(imageView, index) {

        let items = [];
        imageView.find('img').each(function (i, n) {
            items.push({
                src: $(n).attr('src'),
                w: $(n).attr('swipe-width'),
                h: $(n).attr('swipe-height')
            });
        });
        
        let options = {
            index:index
        };

        var gallery = new PhotoSwipe($('.pswp')[0],PhotoSwipeUI_Default, items, options);
        gallery.init();
    }

};
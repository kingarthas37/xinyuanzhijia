'use strict';

let PhotoSwipe = require('photoswipe');
let PhotoSwipeUI_Default = require('photoswipe-ui');
let utils = require('../common/utils');

module.exports = {

    init() {

        this.productId = $('#product-id').val();
        let productId =  $('#product-id').val();
        
        //收藏
        this.favoriteProduct();
        
        //点赞,分享
        this.eventsGood();
        this.eventsShare();
        
        $('.am-slider').flexslider({
            directionNav: false,
            slideshow:false
        });
        
        //主图预览图懒加载
        /*
        $('img.lazy-container').lazyload({
            container: $('.lazy-container-view')
        });
        */

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
        
        //显示附件
        {
            let attachmentContent = $('.attachment-content');
            if(attachmentContent.length) {
                attachmentContent.find('.show').click(function() {
                    if(attachmentContent.hasClass('on')) {
                        attachmentContent.removeClass('on');
                        attachmentContent.find('.am-icon-angle-up').removeClass('am-icon-angle-up').addClass('am-icon-angle-down');
                    } else {
                        attachmentContent.addClass('on');
                        attachmentContent.find('.am-icon-angle-down').removeClass('am-icon-angle-down').addClass('am-icon-angle-up');
                    }
                });
            }
        }
        
        //购买
        {
            let buyButton = $('#buy');
            let modalBuy = $('#modal-buy');
            let shopLink = $('#shop-link');
            let openTbLink = $('.open-tb-link');
            let tbName = $('.tb-name');
            let productMethodId = parseInt($('#product-method-id').val());

            buyButton.click(function() {
             //   modalBuy.find('.success').removeClass('on');
            //    modalBuy.find('.failed').addClass('on');
              //  modalBuy.modal();
                //  addToCart();

           //     $.cookie('cart','',{expires:new Date(new Date().getTime()),path:'http://localhost:3000'});

                if($.cookie('cart')) {
                    let arr = [];
                    arr = $.cookie('cart').split(',');

                    let newArr = []; //去重后

                    arr.forEach(item => {
                        if (!newArr.includes(item)) {
                            newArr.push(item);
                            console.log(newArr);
                        }
                    });

                    newArr.push(productId);
                    $.cookie('cart',newArr.join(),{expires:new Date(new Date().getTime() + 1000*60*60*24*30),path:utils.getCookieUrl()});
                } else {
                    $.cookie('cart',[productId].join(),{expires:new Date(new Date().getTime() + 1000*60*60*24*30),path:utils.getCookieUrl()});
                }

              //  $.cookie('search-result','',{expires:new Date(new Date().getTime()),path:'/'});

               setTimeout(function() {
                   location.href = '/shopping-cart';
               },100);

            });
            
            
            
            let tbLinkValue = '';
            if(/http[^\s]+/.test(shopLink.val())) {
                tbLinkValue = /(http[^\s]+)/.exec(shopLink.val())[1];
                openTbLink.attr('href',tbLinkValue);
            } else {
                openTbLink.attr('href',productMethodId === 3 ? window.taobaoShop.shop1 : window.taobaoShop.shop2);
                tbName.text(productMethodId === 3 ? window.taobaoShop.shop1Name : window.taobaoShop.shop2Name);
            }
        }

        function addToCart() {
            $.ajax({
                url:'/shopping-cart/add',
                type:'post',
                data:{
                    pid:$('#product-id').val(),
                    count:1
                }
            }).then(data => {
                console.info('成功添加到购物车!');
            },error => {
                console.info('添加到购物车失败!',error);
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
                src: $(n).attr('data-original'),
                w: $(n).attr('swipe-width'),
                h: $(n).attr('swipe-height')
            });
        });
        
        let options = {
            index:index
        };

        var gallery = new PhotoSwipe($('.pswp')[0],PhotoSwipeUI_Default, items, options);
        gallery.init();
    },
    
    eventsGood() {
        let _this = this;
        let btnEventsGood = $('.events-good');
        btnEventsGood.click(function() {
            if($(this).hasClass('active')) {
                return false;
            }
            $(this).addClass('active');
            let em = $(this).find('em');
            let count = em.text() || 0;
            if(count === 0) {
                em.text('( 1 )');
            } else {
                em.text(parseInt(count) + 1);
            }
            
            $.ajax({url:`/product/statistics/approval/${_this.productId}`});
        });
        
    },
    
    eventsShare() {
        let _this = this;
        let btnEventsShare = $('.events-share');
        btnEventsShare.click(function() {
            $(this).addClass('active');
            $('body').append('<div class="share-bg"></div>');
            $('.share-bg').click(function() {
                $(this).detach();
            });
            $.ajax({url:`/product/statistics/share/${_this.productId}`});
        });
        
    },

    recommendProducts(groups,groupsName) {
        let products = [];
        for(let i=0;i< groups.length;i++) {
            for(let j=0; j< groups[i].products.length;j++) {
                products.push(groups[i].products[j]);
            }
        }
        if (products.length > 0) {
            $.ajax({
                type:'get',
                url:`/product/recommend/custom/${products.join()}`
            }).then(data => {

                for(let i=0;i< groups.length; i++) {
                    for(let j=0;j<groupsName.length;j++) {
                        if(groups[i].productGroupId === groupsName[j].productGroupId) {
                            groups[i].name = groupsName[j].productGroupName;
                        }
                    }
                }
                for(let i=0; i< groups.length; i++) {
                    groups[i].html = [];
                    for(let j=0; j < groups[i].products.length; j++) {
                        for(let k = 0;k < data.items.length; k++) {
                            if(data.items[k].productId === parseInt(groups[i].products[j])) {
                                groups[i].html.push({
                                    productId:data.items[k].productId,
                                    name:data.items[k].name,
                                    image:utils.productMainImageOutput(data.items[k].mainImage),
                                    price:data.items[k].price,
                                    isHot:data.items[k].isHot
                                });
                            }
                        }
                    }
                }

                groups = groups.filter(n => {
                    return n.html.length;
                });

                this.recommendHtml(groups);

            });
        }
    },
    recommendHtml(data) {
        
        let cont = $('.recommend-content');
        let html = '';
        $.each(data,(i,n)=> {

            html += `<div class="recommend"><h3>${n.name}:</h3></div><div class="am-slider am-slider-default slider-recommend"><ul class="am-slides">`;

            $.each(n.html,(i1,n1) => {
                if(i1 % 3 === 0) {
                    html += `<li>`;
                }
                let hot = n1.isHot ? `<span class="hot"></span>` : '';
                let price = n1.price ? `<em>¥${n1.price}</em>` : '';
                html += `
                    <dl>
                        <dt>
                            <a href="/product/detail/${n1.productId}"><img src="${n1.image}?imageMogr2/thumbnail/250" alt="${n1.name}"></a>
                            ${price}
                        </dt>
                        <dd>${hot}${n1.name}</dd>
                    </dl>
                `;
            });
            
            html += `</ul></div>`;
            
        });

        cont.html(html);
        cont.find('.am-slider').flexslider({
            directionNav: false,
            slideshow:false
        });
        
    }

};
'use strict';

let utils = require('../common/utils');

module.exports = {

    init() {


        //let modalBuy = $('#modal-buy');

        /*
        $('.shop-add-link').each(function(i,n) {
            let clipboard = new Clipboard(n, {
                text: function() {
                    return $(n).data('shop-link');
                }
            });
            clipboard.on('success',data => {
                modalBuy.find('.success').addClass('on');
                modalBuy.find('.failed').removeClass('on');
                modalBuy.modal();
            });
        });
        */

        if($.cookie('cart')) {

            let list = $('.main-list');
            let produstsArr = $.cookie('cart').split(',');

            produstsArr.each(function(i,n) {

                $.ajax({
                    url:'/shopping-cart/get-product',
                    type:'get',
                    data:{
                        id:n
                    }
                }).then(data => {

                    console.log(data);

                },error => {

                });

                list.append(

                    `
                     <li>
        <div class="img">
            <a href="/product/detail/"><img src="//image.wish698.cn/23a7ffd0d52e7424fa1e.png" width="100" height="100" ></a>
        </div>
        <div class="detail">
            <h3>
                <a href="/product/detail" >
                    大地曼陀罗神谕卡 [英/MOTHER EARTH MANDALA CARD] {7246}
                </a>
            </h3>
            <p>
                价格: <span class="price">¥<strong>19</strong></span>
            </p>

        </div>
    </li>
                    
                    `

                );

            });


        } else {
            $('.cart-empty-info').html('<p>购物车为空! <a href="/index">立即去加购商品</a></p>');
        }


        let modalClearCart = $('#modal-clear-cart');
        $('#clear-cart').click(function() {
            modalClearCart.modal({
                relatedTarget: this,
                onConfirm: function(options) {
                    $.cookie('cart','',{expires:new Date(new Date().getTime()),path:utils.getCookieUrl()});
                    location.href = '/shopping-cart';
                }
            });
        });
    }

};
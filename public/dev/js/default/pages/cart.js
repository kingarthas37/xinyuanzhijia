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
            let html = '';

            let newArr = []; //去重后
            let newArrObj = {};
            produstsArr.forEach(item => {
                if (!newArr.includes(item)) {
                    newArr.push(item);
                    newArrObj[item] =1;
                } else {
                    newArrObj[item] ++;
                }
            });




              for(let i in newArrObj) {

                $.ajax({
                    url:'/shopping-cart/get-product',
                    type:'get',
                    data:{
                        id:i
                    }
                }).then(data => {

                    let image = (()=> {
                        let img = '';
                        for(let n in data.data.mainImage) {
                            if (data.data.mainImage[n].isMainImage) {
                                img = data.data.mainImage[n].url;
                                break;
                            }
                        }
                        return img;
                    })();

                   list.append(`
                     <li class="prod-id-${data.data.id}">
                        <div class="img">
                            <a href="/product/detail/${data.data.id}"><img src="${image}" width="100" height="100" ></a>
                        </div>
                        <div class="detail">
                            <h3>
                                <a href="/product/detail/${data.data.id}" >
                                   [ID:${data.data.id}] ${data.data.name}
                                </a>
                            </h3>
                            <p>
                                价格: <span class="price">¥<strong>${data.data.price}</strong></span>
                                <span class="sp"></span>
                                数量：<span class="count">${newArrObj[i]}</span>
                            </p>
                          </div>
                       </li>
                    
                    `);


                },error => {
                    console.log(error);
                });

            };



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
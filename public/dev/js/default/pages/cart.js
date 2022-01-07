'use strict';

let utils = require('../common/utils');

module.exports = {

    init() {


        let list = $('.main-list');
        let priceAll = $('.price-all');


        $('#send-product').click(function() {
            alert('请将购物页面截屏给客服即可');
        });

        list.on('click','.delete',function() {
            $(this).parents('li').detach();
            resetList();
        });

        list.on('click','.count-plus',function() {
            let div = $(this).parents('li');
            let count = parseInt(div.find('.count').text());
            count ++;
            div.find('.count').text(count);
            resetList();
        });

        list.on('click','.count-minus',function() {
            let div = $(this).parents('li');
            let count = parseInt(div.find('.count').text());
            if(count > 1) {
                count --;
                div.find('.count').text(count);
            } else {
                div.detach();
            }
            resetList();
        });

        function resetList() {
            let arr = [];
            list.find('.count').each(function(i,n) {
                let count = parseInt($(this).text());
                for(let i=0;i<count;i++) {
                    arr.push($(n).data('id'));
                }
            });
            $.cookie('cart',arr.join(),{expires:new Date(new Date().getTime() + 1000*60*60*24*30),path:utils.getCookieUrl()});
            console.log($.cookie('cart'));
            resetAllPrice();
        }

        function resetAllPrice() {
            let prices = 0;
            list.find('.price').each(function() {
                let div = $(this).parents('li');
                let price = parseInt($(this).text());
                let count = parseInt(div.find('.count').text());
                price = price * count;
                prices += price;
            });
            priceAll.html(`<p>总金额：<strong>¥</strong><span>${prices}</span></p>`);
        }

        if($.cookie('cart')) {


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
                     <li id="${data.data.id}">
                        <div class="img">
                            <a href="/product/detail/${data.data.id}"><img src="${image}" width="100" height="100" ></a>
                        </div>
                        <div class="detail">
                            <h3>
                                <a href="/product/detail/${data.data.id}" >
                                   [ID:${data.data.id}] ${data.data.name}
                                </a>
                            </h3>
                            <div class="cart-dom">
                                <p>
                                    价格: ¥ <span class="price">${data.data.price}</span>
                                    <span class="sp"></span>
                                  
                                    数量：<a href="javascript:;" class="count-dom count-minus">-</a> <span class="count" data-id="${data.data.id}">${newArrObj[i]}</span> <a href="javascript:;" class="count-dom count-plus">+</a>
                                    <span class="sp"></span>
                                    <a href="javascript:;" class="delete">[删除]</a>
                                </p>
                            </div>
                            
                          </div>
                       </li>
                    
                    `);
                    resetAllPrice();

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
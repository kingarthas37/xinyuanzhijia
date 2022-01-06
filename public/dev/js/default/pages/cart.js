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



        let modalClearCart = $('#modal-clear-cart');
        $('#clear-cart').click(function() {
            modalClearCart.modal({
                relatedTarget: this,
                onConfirm: function(options) {
                    $.cookie('cart','',{expires:new Date(new Date().getTime()),path:location.origin});
                   // location.href = '/shopping-cart?empty=true';
                }
            });
        });
    }

};
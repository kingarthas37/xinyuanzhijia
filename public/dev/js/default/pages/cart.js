'use strict';

let utils = require('../common/utils');

module.exports = {

    init() {
        $('.shop-add-link').click(function() {

            if(utils.isWechatBrowser()) {
                $('body').append('<div class="buy-bg"></div>');
                $('.buy-bg').click(function() {
                    $(this).detach();
                });
            } else {
                $(this).addClass('clicked');
            }
            return false;
        });
        
        let modalClearCart = $('#modal-clear-cart');
        $('#clear-cart').click(function() {
            modalClearCart.modal({
                relatedTarget: this,
                onConfirm: function(options) {
                    location.href = '/shopping-cart?empty=true';
                }
            });
        });
    }

};
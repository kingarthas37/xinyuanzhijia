'use strict';

let utils = require('../common/utils');

module.exports = {

    init() {
 
        if(utils.isWechatBrowser()) {
            $('.buy-button').addClass('on');
            $('#buy').click(function() {
                $('body').append('<div class="buy-bg"></div>');
                $('.buy-bg').click(function() {
                    $(this).detach();
                });
            });
        } else {
            $('.shop-add-link').addClass('on').click(function() {
                $(this).addClass('clicked');
            });
        }
    }

};
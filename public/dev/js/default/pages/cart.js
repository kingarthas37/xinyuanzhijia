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
            
        });
    }

};
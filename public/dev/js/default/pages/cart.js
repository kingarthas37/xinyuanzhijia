'use strict';

let utils = require('../common/utils');

module.exports = {

    init() {
 
        if(utils.isWechatBrowser()) {
            $('#buy').addClass('on').click(function() {
                $('body').append('<div class="buy-bg"></div>');
                $('.buy-bg').click(function() {
                    $(this).detach();
                });
            });
        } else {
            $('.shop-add-link').addClass('on');
        }
    }

};
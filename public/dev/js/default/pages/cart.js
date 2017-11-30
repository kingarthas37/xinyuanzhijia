'use strict';

let utils = require('../common/utils');

module.exports = {

    init() {
 
       $('#buy').click(function() {
           
           alert(utils.isWechatBrowser());
           
           $('body').append('<div class="buy-bg"></div>');
           $('.buy-bg').click(function() {
               $(this).detach();
           });
       });
        
    }

};
'use strict';

let leanAppHeader = window.leanAppHeader;

module.exports = {
    init: function () {
     
        
        if(location.hash) {
            let content = $(`#accordion-${location.hash.substring(1)}`);
            if(content.length) {
                content.addClass('am-active');
                content.find('.am-collapse').addClass('am-in');
            }
        }
        
    }
};
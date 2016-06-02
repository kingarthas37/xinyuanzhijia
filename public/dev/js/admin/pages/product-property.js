'use strict';

let leanAppHeader = window.leanAppHeader;

module.exports = {
    init() {
        
        this.setContentDisplay(); //设置区块打开时显示
    },

    setContentDisplay() {
        if(location.hash) {
            let content = $(`#accordion-${location.hash.substring(1)}`);
            if(content.length) {
                content.addClass('am-active');
                content.find('.am-collapse').addClass('am-in');
            }
        }
    }
};
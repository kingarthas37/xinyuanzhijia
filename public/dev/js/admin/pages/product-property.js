'use strict';

let leanAppHeader = window.leanAppHeader;

module.exports = {
    init() {
        
        this.setContentDisplay(); //设置区块打开时显示
        
        //单独区域设置
        this.setPurchaseLinkContent();
        this.setShopLinkContent();
        
    },

    setContentDisplay() {
        if(location.hash) {
            let content = $(`#accordion-${location.hash.substring(1)}`);
            if(content.length) {
                content.addClass('am-active');
                content.find('.am-collapse').addClass('am-in');
            }
        }
    },
    
    //编辑产品链接
    setPurchaseLinkContent() {
        if(location.hash === '#purchase-link') {
            setTimeout(()=> $('input[name=purchase-link]').get(0).focus(),0);
        }
    },
    
    //编辑淘宝店铺链接
    setShopLinkContent() {
        if(location.hash === '#shop-link') {
            setTimeout(()=> $('input[name=shop-link]').get(0).focus(),0);
        }
    }
};
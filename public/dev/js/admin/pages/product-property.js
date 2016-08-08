'use strict';

let leanAppHeader = window.leanAppHeader;

module.exports = {
    init() {
        
        //如果是iframe modal,则执行parent window关闭
        //如果返回的product-proerty的Location有viewport=window且没有类似#settings,则说明是返回关闭iframe
        if(location.search.indexOf('viewport=window') > -1 && !location.hash) {
            window.parent.closeViewportModal();
            return;
        }
        
        this.setContentDisplay(); //设置区块打开时显示
        
        //单独区域设置
        this.setPurchaseLinkContent();
        this.setShopLinkContent();
        
    },

    setContentDisplay() {
        if(location.hash) {
            let content = $(`#${location.hash.substring(1)}`);
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
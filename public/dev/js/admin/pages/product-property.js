'use strict';

let leanAppHeader = window.leanAppHeader;
let Bloodhound = require('bloodhound');

module.exports = {
    init() {
        
        //如果是iframe modal,则执行parent window关闭
        //如果返回的product-proerty的Location有viewport=window且没有类似#settings,则说明是返回关闭iframe
        if(location.search.indexOf('viewport=window') > -1 && !location.hash && window.parent.closeViewportModal) {
            window.parent.closeViewportModal();
            return;
        }
        
        this.setContentDisplay(); //设置区块打开时显示
        
        //单独区域设置
        this.setPurchaseLinkContent();
        this.setShopLinkContent();
        this.setStockContent();
        this.setSettingsContent();
        this.setContentManage();
        
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
    },
    
    //库存
    setStockContent() {
        let content = $('#stock');
        let stock = content.find('select[name=stock]');
        let sales = content.find('[name=sales]');
        let stockMinus = content.find('.stock-minus');
        let stockPlus = content.find('.stock-plus');
        let reset = $('.stock-reset');
        
        stockMinus.click(function() {
            let stockValue = parseInt(stock.val());
            let salesValue = parseInt(sales.val());
            if(stockValue > 0) {
                stock.find(`option[value=${stockValue - 1}]`)[0].selected = true;
                sales.val(salesValue + 1);
            }
        });

        stockPlus.click(function() {
            let stockValue = parseInt(stock.val());
            stock.find(`option[value=${stockValue + 1}]`)[0].selected = true;
        });
        
        reset.click(function() {
            stock.find(`option[value=${stock.data('stock')}]`)[0].selected = true;
            sales.val(sales.data('sales'));
        });
        
    },

    //设置
    setSettingsContent() {
        if(location.hash === '#settings') {
            setTimeout(()=> $('input[name=price]').get(0).focus(),0);
        }
    },
    
    //内容管理
    setContentManage() {
        
        //品牌名称查询
        var brandInput = $('#brand-id');
        let brandHiddenInput = $('[name=brand-id]');
        brandInput.typeahead(null, {
            limit:10,
            display: function (item) {
                return item.value;
            },
            templates: {
                suggestion: function (item) {
                    return `<div>${item.value}</div>`;
                }
            },
            highlight: true,
            source: new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: '/admin/product-brand/ajax/search',
                    prepare: function (query, settings) {
                        settings.data = {
                            name: brandInput.val()
                        };
                        return settings;
                    }
                }
            })
        });
 
        brandInput.on({
            'typeahead:select':function(event,item) {
                let value = /\{id\:(\d+)\}/.exec(item.value)[1];
                brandHiddenInput.val(value);
            }
        });
        
    }
    
};
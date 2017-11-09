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
        this.setImageSourceLink();

        $('.save-norefresh').click(function () {
              window.parent.gReloadPageVar=false;
        });

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
            stock.trigger('change',true);
        });

        stockPlus.click(function() {
            let stockValue = parseInt(stock.val());
            stock.find(`option[value=${stockValue + 1}]`)[0].selected = true;
            stock.trigger('change',true);
        });
        
        reset.click(function() {
            stock.find(`option[value=${stock.data('stock')}]`)[0].selected = true;
            sales.val(sales.data('sales'));
            stock.trigger('change',true);
        });
        
        
        let ckbWarningStockOut = $('.ckb-warning-stock-out');
        let ckbWarningStockIn = $('.ckb-warning-stock-in');
        let nowStock = parseInt(stock.val());

        ckbWarningStockOut.click(function() {
            ckbWarningStockIn.prop('checked',false);
        });

        ckbWarningStockIn.click(function() {
            ckbWarningStockOut.prop('checked',false);
        });
        
        //库存提醒 n-0 缺货设置 checkbox
        {
            if(nowStock > 0) {
                stock.change(function() {
                    if(parseInt(stock.val()) === 0) {
                        ckbWarningStockOut.prop('checked',true);
                    } else {
                        ckbWarningStockOut.prop('checked',false);
                    }
                });
            }
        }
        
        //库存提醒 0-n 新到货设置 checkbox
        {
            if(nowStock === 0) {
                stock.change(function() {
                    if(parseInt(stock.val()) > 0) {
                        ckbWarningStockIn.prop('checked',true);
                    } else {
                        ckbWarningStockIn.prop('checked',false);
                    }
                });
            }
        }
        
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
        
    },

    setImageSourceLink() {
        let imageSourceDownload = $('.image-source-download');
        let links = $('textarea[name=image-source]').val().split('\n');
        let id= $('#product-id').val();
        if(links.length) {
            $.each(links,function(i,n) {
                imageSourceDownload.append(`<a href="${n}" download="下载.${id}.${i+1}">下载${i+1}</a> `);
            });
        }
        
    }
    
};
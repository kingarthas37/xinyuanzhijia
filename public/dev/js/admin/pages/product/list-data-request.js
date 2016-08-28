'use strict';

module.exports = {

    init() {

        let productListId = [];
        $('.am-table').find('tr[data-product-id]').each(function (i, n) {
            productListId.push($(n).data('product-id'));
        });

        if(!$('span[data-product-id]').length) {
            return;
        }
        
        $.ajax({
            url: '/admin/product/list-data',
            data: {productListId}
        }).then(data => {

            if (!data.success) {
                return false;
            }

            if (data.products.length) {
                $.each(data.products, function (i, n) {
                    
                    //purchase links
                    {
                        let purchaseLink = $(`.purchase-link[data-product-id=${n.productId}]`);
                        let purchaseLinks = '';
                        $.each(n.purchaseLink, function (i, n) {
                            if (n) {
                                purchaseLinks += `<a href=${n} target="_blank"><i class="am-icon-link"></i></a> `;
                            }
                        });

                        if(purchaseLinks) {
                            purchaseLink.html(purchaseLinks);
                        } else {
                            purchaseLink.html('-');
                        }
                    }
                    
                    //shop links
                    {
                        let shopLink =  $(`.shop-link[data-product-id=${n.productId}]`);
                        let shopLinks = '';
                        $.each(n.shopLink, function (i, n) {
                            if (n) {
                                shopLinks += `<a href=${n} target="_blank"><i class="am-icon-link"></i></a> `;
                            }
                        });

                        if(shopLinks) {
                            shopLink.html(shopLinks);
                        } else {
                            shopLink.html('-');
                        }
                    }
                    
                    //stocks
                    {
                        let stock = $(`.stock-num[data-product-id=${n.productId}]`);
                        if(n.stock) {
                            stock.text(n.stock);
                            stock.parent().addClass('instock');
                        }
                    }
                    
                });
            }
        });

    }

};
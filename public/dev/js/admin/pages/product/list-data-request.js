'use strict';

module.exports = {

    init() {

        let productListId = [];
        $('.am-table').find('tr[data-product-id]').each(function (i, n) {
            productListId.push($(n).data('product-id'));
        });

        $.ajax({
            url: '/admin/product/list-data',
            data: {productListId}
        }).then(data => {

            if (!data.success) {
                return false;
            }

            if (data.products.length) {
                $.each(data.products, function (i, n) {
                    let el = $(`.purchase-link[data-product-id=${n.productId}]`);
                    let links = '';
                    $.each(n.purchaseLink, function (i, n) {
                        if (n) {
                            links += `<a href=${n} target="_blank">链接${i + 1}</a> `;
                        }
                    });
                    if(links) {
                        el.html(links);
                    } else {
                        el.html(`<a href="/admin/product-property/${n.productId}#purchase-link">-</a>`);
                    }
                });
            }

        });

    }

};
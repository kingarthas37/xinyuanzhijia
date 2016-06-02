'use strict';

module.exports = {
    
    init() {

        let productListId = [];
        $('.am-table').find('tr[data-product-id]').each(function(i,n) {
            productListId.push($(n).data('product-id'));
        });
        
        $.ajax({
            url:'/admin/product/list-data',
            type:'get',
            data:{
                productListId:productListId
            }
        }).then(data => {

            if(data.success) {
                $.each(data.products,function(i,n) {
                    let el = $(`.purchase-link[data-product-id=${n.productId}]`);
                    let links = '';
                    $.each(n.purchaseLink,function(i,n) {
                        if(n) {
                            links += `<a href=${n} target="_blank">链接${i+1}</a> `;
                        }
                    });
                    el.html(links);
                });
            }
            
        });
        
    }
    
};
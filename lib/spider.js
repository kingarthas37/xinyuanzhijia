'use strict';


module.exports = {
    spider: {
        "www.etsy.com": {
            image: /data-full-image-href="[\s\S]*?"/gi,
            title: /<title>[\s\S]+?<\/title>/gi,
            imageUrl: /"http[\s\S]*?"/gi,
            path: '',
            currency: /<meta itemprop="currency"[^>]*>/gi,
            price: /<meta itemprop="price"[^>]*>/gi,
            overView: /<div id="item-overview">[\s\S]+<ul id="payment-methods">/g,
            description: /<div id="description-text"[^>]*>[\s\S]+<div id="shop-about" class="ui-toolkit">/g,
            replacePrice: /[^0-9\.0-9]/gi,
            replaceCurrency: /[^A-Z]/g,
            replaceTag: /<(?:.|\s)*?>/g,
        },
    },
    domain: /www[\s\S]*\.com|www[\s\S]*\.de?/gi
};
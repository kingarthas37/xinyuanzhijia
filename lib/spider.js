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
            description: /<div id="description-text"[^>]*>[\s\S]+?<\/div>/g,
            replacePrice: /[^0-9\.0-9]/gi,
            replaceCurrency: /[^A-Z]/g,
            replaceTag: /<(?:.|\s)*?>/g,
        },
        "www.thomann.de": {image: /data-media-source=".*?"/gi, title: /<title>[\s\S]*<\/title>/gi, imageUrl: /"[\s\S]*?"/gi, path: 'https://www.thomann.de/pics/bdb/'},
        "www.13moons.com": {image: /id="image-main"[\s\S]*?src="[\s\S]*?"/gi, title: /<title>[\s\S]*<\/title>/gi, imageUrl: /"http[\s\S]*?"/gi, path: ''},
    },
    domain: /www[\s\S]*\.com|www[\s\S]*\.de?/gi
};
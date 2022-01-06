'use strict';

module.exports = {

    //product mainImage 转换
    productMainImageOutput:(mainImage) => {
        for(var i in mainImage){
            if(mainImage[i].isMainImage) {
                return mainImage[i].url;
            }
        }
    },
    
    isWechatBrowser:()=> {
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },

    getCookieUrl:()=> {
        if(location.port=== '3000') {
            return location.origin;
        } else {
            return '/';
        }
    }

};
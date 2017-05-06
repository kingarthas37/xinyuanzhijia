'use strict';

module.exports = {

    //product mainImage 转换
    productMainImageOutput:(mainImage) => {
        for(var i in mainImage){
            if(mainImage[i].isMainImage) {
                return mainImage[i].url;
            }
        }
    }

};
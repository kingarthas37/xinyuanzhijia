'use strict';

module.exports = {
  
    //url参数组合
    urlParamsComponent:(url,params)=> {
        let search = '';
        for(let key in params) {
            if(params[key]) {
                search += `${key}=${params[key]}&`;
            }
        }
        return url + '?' + search.substring(0,search.length-1);
    },

    //product mainImage 转换
    productMainImageOutput:(mainImage) => {
        for(var i in mainImage){
            if(mainImage[i].isMainImage) {
                return mainImage[i].url;
            }
        }
    }
    
};
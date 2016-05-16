'use strict';

let name = '51wish';

//env
window.env = ()=> {
    if (location.hostname === `${name}.leanapp.cn` || location.hostname === `${name}.cn` || location.host === `www.${name}.cn`) {
        return 'production';
    }
    if(location.hostname === `stg-${name}.leanapp.cn`) {
        return 'stage';
    }
    return 'development';
};

let cloud = ()=> {
    if(env() === 'production') {
        return '//51wish.cn/1.1/functions/';
    } 
    if (env() === 'stage') {
        return '//stg-51wish.leanapp.cn/1.1/functions/'; 
    }
    return '/1.1/functions/'
};

window.leanApp = {
    appdId:'QuiPuWpJPzCahsgBK7teBOJN-gzGzoHsz',
    api:'https://leancloud.cn/1.1/',
    cloud:cloud()
};

//lean app header info
window.leanAppHeader = {
    'x-lc-id':leanApp.appdId,
    'x-lc-sign': $.cookie('x_lc_sign') || '',
    'x-lc-session': $.cookie('x_lc_session') || '',
    'x-lc-prod':env() === 'production' ? 1 : 0,
    'content-type':'application/json'
};
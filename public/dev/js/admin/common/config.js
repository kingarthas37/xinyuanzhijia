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
    if (env()=== 'stage') {
        return '//stg-51wish.leanapp.cn/1.1/functions/'; 
    }
    return '/1.1/functions/'
};

window.leanApp = {
    AppID:'QuiPuWpJPzCahsgBK7teBOJN-gzGzoHsz',
    AppKey:'Wwh9RRHIySPlvToe3dsIVfS7',
    MasterKey:'mCIsLsrtOgujruzfcEGDm9Uh',
    api:'https://api.leancloud.cn',
    cloud:cloud()
};

//lean app header info
window.leanAppHeader = {
    'X-LC-Id':window.x_lc_id,
    'X-LC-Sign':window.x_lc_sign,
    'content-type':'application/json',
    'X-lc-prod':env() === 'production' ? 1 : 0
};
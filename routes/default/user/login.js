'use strict';

let user = require('../../../lib/models/user').createNew();
let request = user.getRequest();
let config = user.getConfig();
let router = user.getRouter();

let async = require('async');
let extend = require('xtend');

let data = extend(config.data, {
    title:`${config.data.title}首页`,
    headerTitle:'用户登录/注册',
    currentPage: 'login'
});

router.get('/', (req, res) => {
    let wechatLoginUrl = config.wechatApi.authorize;
    let redirectUrl = config.website.domain + '/login/wechatLogin';
    wechatLoginUrl = wechatLoginUrl.replace('{appid}', config.wechatConfig.appId).replace('{redirectUrl}', redirectUrl).replace('{scopt}', 'snsapi_userinfo').replace('{state}', '51wish');
    
    data = extend(data,{
        wechatLoginUrl:wechatLoginUrl
    });
    
    res.render('default/user/login',data);
});

router.post('/to-login/:mobile/:code', (req, res) => {
    let mobile = req.params.mobile;
    let code = req.params.code;
    user.singIn(mobile,code).then(data => {
        if(data.id) {
            res.send({
                success:1,
                username:data.attributes.username
            });
        } else {
            res.send({
                success:0
            });
        }
    },
    data => {
        console.info(data);
    });
});

router.get('/get-smscode/:mobile', (req, res) => {
    let mobile = req.params.mobile;
    user.requestSmsCode(mobile).then(data => {
        res.send(data);
    });
});

router.get('/wechatLogin', (req, res) => {
    let code = req.query.code;
    if (typeof(code) == 'undefined') {
        res.send('error');
    } else {
        let url = config.wechatApi.authorizeAccessToken;
        url = url.replace('{appid}', config.wechatConfig.appId).replace('{secret}', config.wechatConfig.appSecret).replace('{code}', code);
        let option = {
            url: url,
            json: true,
            method: 'GET',
            headers: {
                "content-type": "application/json"
            }
        };
        request(option, function (error, response, body) {
            if (response.statusCode != 200 || error) {
                res.redirect('/');
                return;
            }
            if (typeof(body.openid) == 'undefined' || typeof(body.access_token) == 'undefined') {
                res.send(body);
                return;
            }
            user.singInWithWechat(body.openid, body.access_token).then(data=>{
                res.send(data);
                return;
            });
        })
    }
});


module.exports = router;
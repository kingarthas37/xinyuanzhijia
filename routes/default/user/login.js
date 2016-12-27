'use strict';

let user = require('../../../lib/models/user').createNew();
let request = user.getRequest();
let config = user.getConfig();
let router = user.getRouter();

router.get('/', (req, res) => {
    let wechatLoginUrl = config.wechatApi.authorize;
    let redirectUrl = config.website.domain + '/login/wechatLogin';
    wechatLoginUrl = wechatLoginUrl.replace('{appid}', config.wechatConfig.appId).replace('{redirectUrl}', redirectUrl).replace('{scopt}', 'snsapi_userinfo').replace('{state}', '51wish');
    res.render('default/user/login', {wechatLoginUrl:wechatLoginUrl});

});

router.get('/toLogin/:mobile/:smsCode', (req, res) => {
    let mobile = req.params.mobile;
    let smsCode = req.params.smsCode;
    user.singIn(mobile, smsCode).then(data => {
        let result = {code:200};
        if(("code" in data)) {
            result = data;
        }
        res.send(result);
    });

});

router.get('/getSmsCode/:mobile', (req, res) => {
    
    let mobile = req.params.mobile;
    user.requestSmsCode(mobile).then(data=> {
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
        console.log(url);
        request(url, function (error, response, body) {
            console.log(body);
            if (response.code != 200 || error) {
                res.send(body);
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
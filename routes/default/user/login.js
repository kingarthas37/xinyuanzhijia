'use strict';

let user = require('../../../lib/models/common-member').createNew();
let base = require('../../../lib/models/base');
let request = user.getRequest();
let config = user.getConfig();
let router = user.getRouter();
let AV = base.getAV();

let async = require('async');
let extend = require('xtend');

let data = extend(config.data, {
    title:`${config.data.name}首页`,
    headerTitle:'用户登录/注册',
    currentPage: 'login'
});


router.get('/', (req,res) => {
    console.log(req.cookies.sessionId);
    /*if(req.cookies.sessionId) {
        res.redirect('/');
    }*/
    let wechatLoginUrl = config.wechatApi.authorize;
    let redirectUrl = config.website.domain + '/user/login/wechat-login';
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
        if(data.length > 0) {
            data = data[0];
            req.session.member = {'username': data.attributes.username, 'id' : data.attributes.commonMemberId, 'objectId' : data.id, 'nickname' : data.attributes.nickname};
            res.cookie('sessionId', data.id, {maxAge: 60*1000*60*24*365});
            res.send({
                success:1,
                username:data.attributes.username,
                isMobileLogin:data.attributes.mobilePhoneVerified
            });
        } else {
            res.send({
                success:0
            });
        }
    },
    error => {
        res.send({
            success:0,error
        });
    });
});

router.get('/get-smscode/:mobile', (req, res) => {
    let mobile = req.params.mobile;
    user.requestSmsCode(mobile).then(data => {
        res.send(data);
    });
});

router.get('/wechat-login', (req, res) => {
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
            console.log('Wechat:');
            console.log(response.statusCode);
            console.log(body);
            if (response.statusCode != 200 || error) {
                res.redirect('/');
                return;
            }
            if (typeof(body.openid) == 'undefined' || typeof(body.access_token) == 'undefined') {
                res.send(body);
                return;
            }
            user.singInWithWechat(body.openid, body.access_token).then(result => {
                if (result.length > 0) {
                    data = result[0];
                    req.session.member = {'username': data.attributes.username, 'id' : data.attributes.commonMemberId, 'objectId' : data.id, 'nickname' : data.attributes.nickname};
                    res.cookie('sessionId', data.id, {maxAge: 60*1000*60*24*365});
                    res.redirect('/');
                }
            });
        });
    }
});


router.get('/logout', (req, res) => {
    req.session.member = false;
    res.cookie('sessionId', false, {maxAge: 1000});
    res.redirect('/');
});

router.get('/wechat-base-login', (req, res) => {
    console.log("Code ======> " + req.query.code);
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
            user.getMemberByOpenId(body.openid).then(result => {
                console.log('Wechat ======> ');
                console.log(result);
                if (result.length > 0) {
                    data = result[0];
                    req.session.member = {'username': data.attributes.username, 'id' : data.attributes.commonMemberId, 'objectId' : data.id, 'nickname' : data.attributes.nickname};
                    res.cookie('sessionId', data.id, {maxAge: 60*1000*60*24*365});
                    res.redirect('/');
                }
            });
        });
    }
});

module.exports = router;
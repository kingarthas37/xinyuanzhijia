'use strict';
let tableName = 'CommonMember';
let base = require('../../lib/models/base');
let commonMember, av, extend, config, request;
let md5 = require('md5');
require('../../lib/utils');

module.exports = {
    init() {
        extend = base.getExtend();
        commonMember = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
        request = base.getRequest();
    },
    createNew(){
        this.init();
        return extend(this, base);
    },
    getExpressInfo(number, type) {
        let option = {
            url: 'http://jisukdcx.market.alicloudapi.com/express/query?number='+number+'&type='+type,
            json: true,
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Authorization" : config.aliExpress.appCode
            }
        };
        let list = null;
        let msg = '系统繁忙请稍后查询';
        return new Promise(function(resolve, reject) {
            request(option, function (error, response, body) {
                if (response.statusCode != 200 || error) {
                    msg = '系统繁忙请稍后查询';
                } else if (body.status != '0') {
                    msg = body.msg;
                } else {
                    list = body.result.list;
                    msg = 'ok';
                }
                resolve({list, msg});
            });
        });
    }
};
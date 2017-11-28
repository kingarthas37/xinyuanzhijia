'use strict';

let orderTrack = require('../../../lib/models/order-track').createNew();
let aliExpress = require('../../../lib/models/ali-express').createNew();
let config = orderTrack.getConfig();
let router = orderTrack.getRouter();
let extend = orderTrack.getExtend();

let data = extend(config.data, {
    title: `${config.data.name} - 我的快递查询`,
    currentPage: 'order-index',
    headerTitle:'历史发货订单查询 '
});

//首页
router.get('/', (req, res) => {
    orderTrack.isWebUserLogin(req,res);
    data = extend(data, {'items': null, 'msg': ''});
    let member = orderTrack.getDecodeByBase64(req.cookies.login);
    data = extend(data, {'mobile': member.mobile});
    let mobile = req.query.mobile;
    let re = /^1\d{10}$/;
    if (mobile) {
        data.mobile = mobile;
        if (re.test(mobile)) {
            orderTrack.getOrderByMobile(mobile, 10, 'createdAt').then(result => {
                if (result.length > 0) {
                    data.items = result;
                } else {
                    data.msg = '<i class="am-icon-warning color-orange"></i> 您的订单可能尚未入库或发货,我们会尽快进行处理,请于晚些时候或明日再进行查询,谢谢!';
                }
                res.render('default/order/express', data);
            });
        } else {
            data.msg = '<i class="am-icon-warning color-orange"></i> 请输入正确的手机号';
            res.render('default/order/express', data);
        }
    } else {
        res.render('default/order/express', data);
    }

});

router.get('/query/:number/:type', (req, res) => {
    let number = req.params.number;
    let com = req.params.type;
    if (!number || !com) {
        res.send({'list':null, 'msg':'系统繁忙请稍后重新进行查询'});
    } else {
        aliExpress.getExpressInfo(number, com).then(result => {
            res.send(result);
        });
    }
});

module.exports = router;
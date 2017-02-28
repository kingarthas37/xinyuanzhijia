'use strict';

let orderTrack = require('../../../lib/models/order-track').createNew();
let aliExpress = require('../../../lib/models/ali-express').createNew();
let config = orderTrack.getConfig();
let router = orderTrack.getRouter();
let extend = orderTrack.getExtend();

let data = extend(config.data, {
    title: `${config.data.name} - 我的快递查询`,
    currentPage: 'order-index'
});

//首页
router.get('/', (req, res) => {
    orderTrack.isWebUserLogin(req,res);
    data = extend(data, {'items': null});
    let member = orderTrack.getDecodeByBase64(req.cookies.login);
    data = extend(data, {'mobile': member.mobile});
    let mobile = req.query.mobile;
    if (mobile) {
        data.mobile = mobile;
        orderTrack.getOrderByMobile(mobile).then(result => {
            console.log(result);
            if (result) {
                data.items = result;
            }
            res.render('default/order/express', data);
        });
    } else {
        res.render('default/order/express', data);
    }
});

router.get('/query/:number/:type', (req, res) => {
    let number = req.params.number;
    let com = req.params.type;
    if (!number || !com) {
        res.send({'list' : null, 'msg' : '系统繁忙请稍后查询'});
    } else {
        aliExpress.getExpressInfo(number, com).then(result => {
            res.send(result);
        });
    }
});

module.exports = router;
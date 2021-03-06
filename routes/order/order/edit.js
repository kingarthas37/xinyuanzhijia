'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var config = require('../../../lib/config');
var utils = require('../../../lib/utils');
var flash = require('connect-flash');

var async = require('async');
var extend = require("xtend");

//class
var Customer = AV.Object.extend('Customer');
var OrderTrack = AV.Object.extend('OrderTrack');

var data =  extend(config.data,{
    title:'订单编辑-编辑订单',
    currentPage:'order'
});


//编辑产品页
router.get('/:orderId', function (req, res, next) {

    if(!req.currentUser) {
        return res.redirect('/?return=' + encodeURIComponent(req.originalUrl));
    }
    
    var orderId = parseInt(req.params.orderId);
    let searchNotShipped = req.query['search-notshipped'];

    data = extend(data,{
        flash: { success:req.flash('success'), error:req.flash('error') },
        user:req.currentUser,
        id: orderId,
        searchNotShipped
    });

    
    async.series([

        function (cb) {

            var query = new AV.Query(OrderTrack);
            query.equalTo('orderId', orderId);
            query.first({
                success: function (results) {
                    data = extend(data, {
                        order: results
                    });
                    cb();
                },
                error: function (err) {
                    next(err);
                }
            });

        },

        function () {
            res.render('order/order/edit', data);
        }

    ]);


});

router.post('/', function (req, res, next) {

    if(!req.currentUser) {
        return res.redirect('/?return=' + encodeURIComponent(req.originalUrl));
    }
    
    
    var orderId = parseInt(req.body['order-id']);

    var name = typeof req.body['name'] === 'object' ? req.body['name'] : [req.body['name']];
    var shippingCount = typeof req.body['shipping-count'] === 'object' ? req.body['shipping-count'] : [req.body['shipping-count']];
    let isGift = typeof req.body['is-gift'] === 'object' ? req.body['is-gift'] : [req.body['is-gift']];
    isGift = isGift.map(item => parseInt(item) ? true : false);
    let isShipping = typeof req.body['is-shipping'] === 'object' ? req.body['is-shipping'] : [req.body['is-shipping']];
    isShipping = isShipping.map(item => parseInt(item) ? true : false);
    var customerId = parseInt(req.body['customer-name-id']);
    var client = req.body['client'].trim();
    let clientAddress = req.body['client-address'].trim();
    var shopOrderLink = req.body['shop-order-link'].trim();
    shopOrderLink = utils.urlCompleting(shopOrderLink);
    var shippingDate = req.body['shipping-date'];
    var shippingCompany = req.body['shipping-company'];
    var trackingNumber = req.body['tracking-number'].trim();
    var shippingStatus = req.body['shipping-status'];
    var comment = req.body['comment'].trim();
    var customerName = req.body['customer-name'].trim();
    var shippingAddress = req.body['shipping-address'].trim();
    var taobao = req.body['taobao'].trim();
    var customer = new Customer();
    let isNewShop = req.body['is-new-shop'];
    
    async.waterfall([
        //取到新的customerId,如果有customerId,则保存到order，否则保存已有的customerId
        function() {

            var query = new AV.Query(OrderTrack);
            query.equalTo('orderId',orderId);
            query.first().then(function(orderTrack){

                //productId shipping
                let productId = [];
                for(let i=0;i<name.length;i++) {
                    if(/\{id\:\d+\}/.test(name[i])) {
                        productId.push(/\{id\:(\d+)\}/.exec(name[i])[1]);
                    }else {
                        productId.push("");
                    }
                }

                //shipping count
                shippingCount = shippingCount.map(item => parseInt(item));

                orderTrack.set('name',name);
                orderTrack.set('productId',productId);
                orderTrack.set('isGift',isGift);
                orderTrack.set('isShipping',isShipping);
                orderTrack.set('shippingCount',shippingCount);
                orderTrack.set('client',client);
                orderTrack.set('clientAddress',clientAddress);
                orderTrack.set('shopOrderLink',shopOrderLink);
                orderTrack.set('customerId',customerId);
                orderTrack.set('customerName',customerName);
                orderTrack.set('taobaoName',taobao);
                orderTrack.set('shippingDate',new Date(shippingDate));
                orderTrack.set('shippingAddress',shippingAddress);
                orderTrack.set('shippingCompany',shippingCompany);
                orderTrack.set('trackingNumber',trackingNumber);
                orderTrack.set('shippingStatus',shippingStatus);
                orderTrack.set('comment',comment);
                orderTrack.set('isNewShop',isNewShop ==='on' ? true:false);

                orderTrack.save(null, {
                    success: function () {
                        let notshipped = req.query['search-notshipped'] === 'on' ? '?search-notshipped=on' : '';
                        req.flash('success', '编辑订单成功!');
                        res.redirect(`/order/order${notshipped}`);
                    },
                    error: function (err) {
                        next(err);
                    }
                });
                
            });
            
        }
    
    ]);
    
 

});

module.exports = router;
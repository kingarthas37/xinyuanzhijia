'use strict';
let tableName = 'ShoppingCart';
let base = require('../../lib/models/base');
let shoppingCart, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        shoppingCart = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    add(datas) {
        let productId = parseInt(datas.productId);
        let commonMemberId = parseInt(datas.commonMemberId);
        let count = parseInt(datas.count);
        let query = new av.Query(shoppingCart);
        query.equalTo('productId', productId);
        query.equalTo('commonMemberId', commonMemberId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                if(item) {
                    item.set('count', (item.get('count')+count));
                    item.set('status', true);
                    item.save();
                    resolve(item);
                } else {
                    let cart = new shoppingCart();
                    cart.set('productId', productId);
                    cart.set('commonMemberId', commonMemberId);
                    cart.set('status', true);
                    cart.set('count', count);
                    cart.save();
                    resolve(item);
                }
            });
        });
    },
    getShoppingCartsByMemberId(commonMemberId, options) {
        let query = new av.Query(shoppingCart);
        query.equalTo('commonMemberId', commonMemberId);
        query.equalTo('status', true);
        /*if (options.page) {
            query.skip((options.page - 1) * options.limit);
        }
        let limit = options.limit || 20;
        query.limit(limit);*/
        let order = options.order || 'updatedAt';
        query['descending'](order);
        return new Promise(function(resolve, reject) {
            query.find().then(items=> {
                resolve(items);
            });
        });
    },
    getShoppingCartByProductIdAndMemberId(productId, commonMemberId) {
        let query = new av.Query(shoppingCart);
        query.equalTo('productId', productId);
        query.equalTo('commonMemberId', commonMemberId);
        return new Promise(function(resolve, reject) {
            query.first().then(item=> {
                resolve(item);
            });
        });
    }
}
'use strict';
let tableName = 'ProductClick';
let base = require('../../lib/models/base');
let productClick, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        productClick = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    setProductClick(memberId,productAll,productAllId) {
        this.add({'memberId': parseInt(memberId), 'productType': productAll, 'productId': parseInt(productAllId)});
    },
    add(options) {
        let click = new productClick();
        if (options.memberId) {
            click.set('commonMemberId', options.memberId);
        }
        click.set('productType', options.productType);
        click.set('productId', options.productId);
        click.save();
    },
    getProductClickByProductId(productId, options) {
        let query = new av.Query(productClick);
        query.equalTo('productId', productId);
        let limit = options.limit || 9;
        query.limit(limit);
        query['descending']('productClickId');
        return new Promise(function (resolve, reject) {
            query.find().then(item => {
                resolve(item);
            });
        });
    },
    getProductIdArrayByMemberIdArray(memberIdArray, productId, limit) {
        var cql = 'select productId from ProductClick where productId != '+productId+' and commonMemberId in ('+memberIdArray.toString()+') limit ' + limit;
        let productIdArray = new Array();
        return new Promise(function (resolve, reject) {
            av.Query.doCloudQuery(cql).then(function (data) {
                let resutl = data.results;
                if (resutl.length > 0) {
                    for (var i in resutl) {
                        if (!(productIdArray.indexOf(resutl[i].get('productId'))>=0)) {
                            productIdArray.push(resutl[i].get('productId'));
                        }
                        if (productIdArray.length >= 9) {
                            break;
                        }
                    }
                }
                resolve(productIdArray);
            }, function (error) {
                resolve(error);
            });
        });
    },
    getProductClickByMemberId(memberId, limit) {
        let query = new av.Query(productClick);
        query.equalTo('commonMemberId', memberId);
        limit = limit || 50;
        query.limit(limit);
        query['descending']('createdAt');
        return new Promise(function (resolve, reject) {
            query.find().then(item => {
                resolve(item);
            });
        });
    }
}
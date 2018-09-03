'use strict';
let tableName = 'Product';
let base = require('../../lib/models/base');
let product, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        product = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    getProducts(options, isCount){
        let limit = options.limit || 20;
        let page = (options.page - 1) * limit;
        let order = '';
        if (!options.select) {
            options.select = 'objectId,isHandmade,imageSource,tags,reserve,isHot,sales,originalPrice,category1,category2,name,productId,price,isOnsale,mainImage,pageViews,isOnly,stock,isRefund,productMethod,purchaseLink,shopLink,groups,approval,onsaleDate,isShortStock,isUpdateStock,updateStockDate, offlineTag, costPrice,sold,isTranslation,parentProductId,isParent,isSales,isStock,discount,maximum'
        }
        var cql = 'select ' + options.select + ' from Product where objectId != null';
        if (isCount) {
            cql = 'select count(*) from Product where objectId != null';
        }
        var pvalues = [];
        if (options.onsale > 0) {
            let onSale = (options.onsale == 1 ? true : false);
            cql += ' and isOnsale = ?';
            pvalues.push(onSale);
        }
        if (options.stock) {
            cql += ' and stock > 0';
        }
        if (options.productMethodId) {
            cql += ' and productMethod in (?)';
            pvalues.push(parseInt(options.productMethodId));
        }
        if (options.category2Id) {
            cql += ' and category2 = ?';
            pvalues.push(parseInt(options.category2Id));
        }
        if (options.search) {
            if (isNaN(options.search)) {
                cql += " and name regexp '(?i)"+options.search+"'";
            } else {
                cql += " and productId = ?";
                pvalues.push(parseInt(options.search));
            }
        }
        if (options.category1Id) {
            cql += ' and category1 = ?';
            pvalues.push(parseInt(options.category1Id));
        }

        if (options.ids) {
            cql += ' and productId in ('+options.ids+')';
        }
        if (options.isShortStock) {
            cql += ' and isShortStock = ?';
            pvalues.push(options.isShortStock);
        }
        if (options.isUpdateStock) {
            cql += ' and isUpdateStock = true';
        }
        if (options.updateStockDate) {
            if (options.updateStockDate == '1') {
                cql += ' and (updateStockDate > 1)';
            } else if (options.updateStockDate == '0') {
                cql += ' and (updateStockDate = 0)';
            }
            cql += ' and isOnsale = true';
        }
        if (options.adminStock) {
            cql += ' and stock = ?';
            pvalues.push(parseInt(options.adminStock));
        }
        if (options.hot) {
            cql += ' and isHot = ?'
            pvalues.push((parseInt(options.hot) == 1 ? true : false));
        }
        if (options.isTranslation) {
            cql += ' and isTranslation = true';
        }
        if (options.isSales) {
            cql += ' and (isSales = 1 or isSales = 2 or isSales = 3 or isSales = 4)';
            options.order =  'isSales';
        }
        if (options.parentProductId) {
            cql += ' and (parentProductId = '+options.parentProductId+' or productId ='+options.parentProductId+')';
            order = ' order by isParent desc';
        }
        if (!isCount) {
            if (!options.parentProductId) {
                if (options.price) {
                    order = ' order by price ' + options.price;
                } else {
                    if (options.order && options.order != 'productId') {
                        order = ' order by '+options.order+' desc';
                    } else if (options.order == 'productId') {
                        order = ' order by '+options.order+' asc';
                    }
                }
            }
            cql += order;
            cql += ' limit ?, ?';
            pvalues.push(page);
            pvalues.push(limit);
        }
        return new Promise(function(resolve, reject) {
            av.Query.doCloudQuery(cql, pvalues).then(function (data) {
                let result = data.results;
                if (isCount) {
                    result = data.count;
                }
                resolve(result);

            }, function (error) {
                resolve(error);
            });
        });
    },
    getProductById(id){
        let query = new av.Query(product);
        query.equalTo('productId', id);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                resolve(item);
            });
        });
    },
    getProductByIdAndMethod(id, productMethod){
        let query = new av.Query(product);
        query.equalTo('productId', id);
        query.containsAll('productMethod', productMethod);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                resolve(item);
            });
        });
    },
    updateProductPageViews(product) {
        product.set('pageViews', (product.get('pageViews')+1));
        product.save();
    },
    update(options, productId) {
        let query = new av.Query(product);
        query.equalTo('productId', productId);
        query.first().then(item => {
            item.set('isOnsale', options.isOnsale);
            item.set('stock', options.stock);
            item.set('sales', options.sales);
            item.set('isHandmade', options.isHandmade);
            item.set('isDocument', options.isDocument);
            item.set('shopLink', options.shopLink);
            item.set('purchaseLink', options.purchaseLink);
            item.save();
        });
    },
    getMct(startTime, endTime, sign) {
        var startTime = startTime.split(sign);
        var endTime = endTime.split(sign);
        var bMonth = parseInt(startTime[0]) * 12 + parseInt(startTime[1]);
        var eMonth = parseInt(endTime[0]) * 12 + parseInt(endTime[1]);
        var totalMonth = Math.abs(eMonth - bMonth);
        return totalMonth;
    },
    updateProductShareByProductId(productId) {
        let query = new av.Query(product);
        query.equalTo('productId', productId);
        query.first().then(item => {
            item.set('share', (item.get('share')+1));
            item.save();
        });
    },
    updateProductApprovalByProductId(productId) {
        let query = new av.Query(product);
        query.equalTo('productId', productId);
        query.first().then(item => {
            item.set('approval', (item.get('approval')+1));
            item.save();
        });
    },
    getProductsByCategoryId(categoryId) {
        let query = new av.Query(product);
        query.containsAll('category2', categoryId);
        return new Promise(function(resolve, reject) {
            query.find().then(items => {
                resolve(items);
            });
        });
    },
    getProductsByUpdateStockDate(limit, productMethod, page) {
        let query = new av.Query(product);
        query.greaterThan('updateStockDate', 1);
        query.containsAll('productMethod', productMethod);
        query.skip((page - 1) * limit);
        query.limit(limit);
        query['descending']('updateStockDate');
        return new Promise(function(resolve, reject) {
            query.find().then(items=> {
                resolve(items);
            });
        });
    },
    getProductsByPageViews(limit, productMethod, page) {
        let query = new av.Query(product);
        query.containsAll('productMethod', productMethod);
        query.skip((page - 1) * limit);
        query.limit(limit);
        query['descending']('pageViews');
        return new Promise(function(resolve, reject) {
            query.find().then(items=> {
                resolve(items);
            });
        });
    },
    updateProductFieldByProductId(productId, fields, values) {
        let query = new av.Query(product);
        query.equalTo('productId', productId);
        query.first().then(item => {
            for (var i = 0; i < fields.length; i++) {
                item.set(fields[i], values[i]);
            }
            item.save();
        });
    },
    getProductByNameEn(nameEn) {
        let query = new av.Query(product);
        query.equalTo('nameEn', nameEn.toUpperCase());
        return new Promise(function(resolve, reject) {
            query.first().then(item=> {
                resolve(item);
            });
        });
    }
}
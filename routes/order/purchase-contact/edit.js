'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var config = require('../../../lib/config');
var utils = require('../../../lib/utils');

var flash = require('connect-flash');

var async = require('async');
var extend = require("xtend");

//class
var PurchaseContact = AV.Object.extend('PurchaseContact');

var data =  extend(config.data,{
    title:'编辑网站联系方式',
    currentPage:'purchase-contact'
});


router.get('/:purchaseContactId', function (req, res, next) {

    if(!req.currentUser) {
        return res.redirect('/?return=' + encodeURIComponent(req.originalUrl));
    }
    
    var purchaseContactId = parseInt(req.params.purchaseContactId);
 
    data = extend(data,{
        flash: { success:req.flash('success'), error:req.flash('error') },
        user:req.currentUser
    });

    var query = new AV.Query(PurchaseContact);
    query.equalTo('purchaseContactId', purchaseContactId);
    query.first().then(function(results) {

        data = extend(data, {
            purchaseContact: results
        });

        res.render('order/purchase-contact/edit', data);

    });
    
});

router.post('/', function (req, res, next) {

    if(!req.currentUser) {
        return res.redirect('/?return=' + encodeURIComponent(req.originalUrl));
    }

    var name = req.body['name'];
    var description = req.body['description'];
    var shop =req.body['shop'];
    var website = req.body['website'];
    var email =req.body['email'];
    var imageUrl = req.body['image-url'];
    var siteType = req.body['site-type'];

    shop = utils.urlCompleting(shop);
    website = utils.urlCompleting(website);
    imageUrl = utils.urlCompleting(imageUrl);
    
    var purchaseContactId = parseInt(req.body['purchase-contact-id']);
    
    data = extend(data,{
        flash: {
            success:req.flash('success'),
            error:req.flash('error')
        }
    });

    var query = new AV.Query(PurchaseContact);
    query.equalTo('purchaseContactId',purchaseContactId);
    
    query.first().then(function(purchaseContact) {
        
        purchaseContact.set('name',name);
        purchaseContact.set('description',description);
        purchaseContact.set('shop',shop);
        purchaseContact.set('website',website);
        purchaseContact.set('email',email);
        purchaseContact.set('imageUrl',imageUrl);
        purchaseContact.set('siteType',siteType);
        
        return purchaseContact.save();
        
    }).then(function(results) {

        data = extend(data, {
            purchaseContact: results
        });

        let site = siteType === 'etsy' ? '?site-type=etsy' : '';
        req.flash('success', '编辑联系方式!');
        res.redirect(`/order/purchase-contact${site}`);
    
    });
    
});

module.exports = router;
'use strict';

var AV = require('leanengine');

AV.Cloud.define('hello', function(request, response) {
    response.success({name:'kingarthas'});
});

module.exports = AV.Cloud;
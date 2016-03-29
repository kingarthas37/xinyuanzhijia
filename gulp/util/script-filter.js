'use strict';

var path = require('path');
var fs = require('fs');
var config = require('../../package.json');
 

module.exports = function(url) {

    var files = [];
    
    var dirs = fs.readdirSync(url);
    dirs.forEach(function(n) {

        var _url = path.join(config.path.jsDev,'pages',n);
        
        var stat = fs.statSync(_url);
        if(stat.isDirectory()) {
            var _dirs = fs.readdirSync(_url);
            _dirs.forEach(function(_n) {
                if(isJsFile(_n)) {
                    files.push(n + '/' + _n);
                }
            });
              
        } else {
            if(isJsFile(n)) {
                files.push(n);
            }
        }
        
    });
    
    return files;
    
};


function isJsFile(name) {
    return /(\.(js)$)/i.test(path.extname(name));
}
'use strict';

module.exports = {
    getAV(){
        return require('leanengine');
    },
    getObject(name){
        return this.getAV().Object.extend(name);
    },
    getExtend(){
        return require('xtend');
    },
    getConfig(){
        return require('../config');
    }
};

'use strict';
let tableName = 'CommonMemberSearchHistory';
let base = require('../../lib/models/base');
let commonMemberSearchHistory, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        commonMemberSearchHistory = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    setHistory(memberId, keywords, productSearchHistoryId){
        this.add({memberId,keywords,productSearchHistoryId});
    },
    add(datas){
        if (datas.memberId && datas.keywords && datas.productSearchHistoryId) {
            let memberSearchHistory = new commonMemberSearchHistory();
            memberSearchHistory.set('commonMemberId', parseInt(datas.memberId));
            memberSearchHistory.set('keywords', datas.keywords);
            memberSearchHistory.set('productSearchHistoryId', parseInt(datas.productSearchHistoryId));
            memberSearchHistory.save();
        }
    }
}
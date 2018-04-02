'use strict';

let leanAppHeader = window.leanAppHeader;
let utils = require('../common/utils');

module.exports = {
    indexFun() {
        $('h4').each(function (i,n) {
            let text = $(n).text();
            text = text.replace('**小提示:** 由于此类产品出货量较大，时有出现缺货的情况，如暂无现货，建议亲可以选择同类具有相同作用的产品替代，也会有同样的反馈哦，详情可询问暮雪的心愿城客服为您推荐:)','');
            text = text.replace('**[暮雪的心愿城英译]:**','');
            text = text.replace('**[暮雪的心愿城原文翻译]:**','');
            $(n).text(text);
        });
    }
};
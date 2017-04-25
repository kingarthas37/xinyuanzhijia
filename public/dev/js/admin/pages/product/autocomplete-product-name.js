'use strict';

var Bloodhound = require('bloodhound');


module.exports = {
    
    //匹配autoomplete产品名字
    getName(el) {

        let element = $(el);
        element.typeahead(null, {
            display: function (item) {
                return item.value;
            },
            templates: {
                suggestion: function (item) {
                    return `<div><img src="${item.image}?imageMogr2/thumbnail/32" />${item.value} </div>`;
                }
            },
            highlight: true,
            source: new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: '/admin/product/get-product',
                    prepare: function (query, settings) {
                        settings.data = {
                            name: element.val()
                        };
                        return settings;
                    }
                }
            })
        });
    
    },
    
    //通过id获取产品
    getId(input,id,callback) {
        $.ajax({
            url:`/admin/product/get-id/${id}`,
            type:'get'
        }).then(data => {
            if(data.success) {
                input.value = `${data.result.name} {id:${id}}`;
                callback();
            }
        });
    }
};

 
'use strict';

let autocomplete = require('./product/autocomplete-product-name');
let utils = require('../common/utils');

module.exports = {

    indexFun:function() {
   
        let productId = $('#product-id').val();
        let productMethodId = $('#product-method-id').val();
        let category1Id = $('#category1-id').val();
        let category2Id = $('#category2-id').val();
        
        let formGroups = $('#form-edit-groups');
        let productName = $('.product-name');

        //通过id获取详细产品名,随后加载autocomplete
        {
            productName.each((i,n) => {
                if(/\d+/.test(n.value)) {
                    autocomplete.getId(n,n.value,function() {
                        autocomplete.getName(n);
                    });
                }
            });
        }
        
        let gorupHtml = `
            <div class="am-form-group">
                <div class="input">
                    <input class="product-name" type="text" placeholder="输入产品名称(自动填充)" autocomplete="off">
                </div>
                <div class="del">
                    <a href="javascript:;">- 删除</a>
                </div>
            </div>
        `;
        
        $('.product-group-add').click(function() {
            let group = $(this).parents('.product-group');
            let list = group.find('.list-group-field');
            list.append(gorupHtml);
            autocomplete.getName(group.find('.product-name:last'));
            group.find('.product-name:last')[0].focus();
        });

        formGroups.on('click','.del a',function() {
            $(this).parent().parent().detach(); 
        });
        
        //ajax
        $('#submit').click(function() {
           
            let $this = $(this);
            let json = [];
            
            $('.product-group').each((i,n)=> {
                json.push({});
                json[i].productGroupId = $(n).data('group-id');
                json[i].products = [];
                
                let products = $(n).find('.product-name').filter(function() {
                    return !$(this).attr('readonly');
                });

                products.each((j,n)=> {
                    if(/\{id\:\d+\}/.test(n.value)) {
                        let value = /\{id\:(\d+)\}/.exec(n.value)[1];
                        json[i].products.push(value);
                    }
                });
            });

            $this.prop('disabled',true);
            $.ajax({
                url:`/admin/product/groups/${productId}`,
                type:'post',
                data:{
                    groups:JSON.stringify(json)
                }
            }).then(data => {
                if(data.success) {
                    return location.href = `/admin/product?product-method-id=${productMethodId}&category1-id=${category1Id}&category2-id=${category2Id}`;   
                }
                $this.prop('disabled',false);
            });
            
            return false;
        });
         
    }
};
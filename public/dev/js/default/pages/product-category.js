'use strict';

require('jquery-validate');

var leanApp = window.leanApp;

module.exports = {

    indexFun:function() {
        
        var categoryList1 = $('.am-accordion');
        
        //添加一级分类
        {
            
            let modal = $('#modal-category-1-add');
            let input = $('#input-category-1-add');
            let confirm = $('#modal-category-1-add-confirm');
            
            $('.btn-category-1-add').click(function() {
                modal.modal({
                    relatedTarget: this
                });
            });

            confirm.click(function() {
                
                if(confirm.data('modal')) {
                    return false;
                }
                
                $.AMUI.progress.start();
                confirm.data('modal',true);
                
                $.post({
                    url:leanApp.api + 'classes/ProductCategory1',
                    headers:{
                        'x-avoscloud-application-id':leanApp.AppID,
                        'x-avoscloud-application-key':leanApp.AppKey,
                        'content-type':'application/json'
                    },
                    data:JSON.stringify({
                        "index":9,
                        "name": $.trim(input.val())
                    }),
                    success:function() {
                        $.AMUI.progress.done();
                        confirm.data('modal',false);
                        modal.modal('close');
                        location.reload();
                    }
                });
                
                return false;
            });
        }
        
        //删除一级分类
        {
            let removeLink = $('.remove-category-1');
            let modal = $('#modal-category-1-remove');
            let alert = $('#modal-alert');
            
           removeLink.each(function(i,n) {

               $(n).click(function() {
                   modal.modal({
                       relatedTarget: this,
                       onConfirm:function() {

                           if($(n).data('modal')) {
                               return false;
                           }

                           $(n).data('modal',true);
                           $.AMUI.progress.start();

                           $.get({
                               url:'/admin/product-category/remove-category-1',
                               data:{
                                   id:$(n).attr('data-id')
                               },
                               success:function(data) {
                                   $(n).data('modal',false);
                                   $.AMUI.progress.done();
                                   modal.modal('close');
                                   alert.modal({
                                       onConfirm:()=> {
                                           location.reload();
                                       }
                                   }).find('.am-modal-bd').text(data.message);
                               }
                           });

                           return false;
                       }
                   });
                   return false;
               });
               
           });
        }
        
    }

};
'use strict';

require('jquery-validate');

var leanAppHeader = window.leanAppHeader;

module.exports = {

    indexFun:function() {
        this.addCategory1();
        this.editCategory1();
        this.removeCategory1();
        this.moveCategory1Up();
        this.moveCategory1Down();
    },

    //添加一级分类
    addCategory1:function() {
        
        let modal = $('#modal-category-1-add');
        let input = $('#input-category-1-add');
        let confirm = $('#modal-category-1-confirm-add');

        $('.btn-category-1-add').click(function() {
            input.val('');
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
                headers:leanAppHeader,
                data:JSON.stringify({
                    index:$('.am-accordion-item').length,
                    name:$.trim(input.val())
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
    },

    //编辑一级分类
    editCategory1:function() {

        let modal = $('#modal-category-1-edit');
        let input = $('#input-category-1-edit');
        let confirm = $('#modal-category-1-confirm-edit');
        let alert = $('#modal-alert');

        let currentId = null;

        $('.edit-category-1').each(function() {
            $(this).click(function() {
                var text = $(this).parents('.am-accordion-title').find('strong').text();
                input.val($.trim(text));
                modal.modal({
                    relatedTarget:this
                });
                currentId = $(this).parents('.am-accordion-item').attr('data-id');
                return false;
            });
        });

        confirm.click(function() {

            if(confirm.data('modal')) {
                return false;
            }

            $.AMUI.progress.start();
            confirm.data('modal',true);

            $.get({
                url:leanApp.api + 'classes/ProductCategory1',
                headers:leanAppHeader,
                data:'where={"productCategory1Id":'+ currentId +'}'
            }).done(data => {
                return $.ajax({
                    type:'PUT',
                    url:leanApp.api + 'classes/ProductCategory1/' + data.results[0].objectId,
                    headers:leanAppHeader,
                    data:JSON.stringify({
                        name:$.trim(input.val())
                    })
                });
            }).done(() => {
                confirm.data('modal',false);
                $.AMUI.progress.done();
                modal.modal('close');
                alert.modal({
                    onConfirm:()=>location.reload()
                }).find('.am-modal-bd').text('编辑一级分类成功!');
            });

            return false;
        });
        
    },

    //删除一级分类
    removeCategory1:function() {

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

                        //删除一级分类需要判断该产品是否已使用该分类,所以不能使用api调用
                        $.get({
                            url:'/admin/product-category/remove-category-1',
                            data:{
                                id:$(n).parents('.am-accordion-item').attr('data-id')
                            },
                            success:function(data) {
                                $(n).data('modal',false);
                                $.AMUI.progress.done();
                                modal.modal('close');
                                alert.modal({
                                    onConfirm:()=>location.reload()
                                }).find('.am-modal-bd').text(data.message);
                            }
                        });

                        return false;
                    }
                });
                return false;
            });

        });
        
    },
    
    //分类1上移
    moveCategory1Up:function() {
        
        let list = $('.am-accordion-item');
        
        let state = false;
        
        $('.moveup-category-1').each(function() {

            $(this).click(function() {
                
                let content = $(this).parents('.am-accordion-item');
                let target = content.prev();
                let index = content.index();
                
                if(index === 0) {
                    return false;
                }
                
                if(state) {
                    return false;
                }

                state = true;
                $.AMUI.progress.start();
                
                $.get({
                    url:'/admin/product-category/move-category-1-up',
                    data:{index:index}
                }).done(data => {
                    if(data.success) {
                        content.after(target);
                        state = false;
                        $.AMUI.progress.done();
                    }
                });

                return false;
            });
            
        });
        
        
    },

    //分类1下移
    moveCategory1Down:function() {

        let list = $('.am-accordion-item');

        let state = false;

        $('.movedown-category-1').each(function() {

            $(this).click(function() {

                let content = $(this).parents('.am-accordion-item');
                let target = content.next();
                let index = content.index();

                if(index === list.length-1) {
                    return false;
                }

                if(state) {
                    return false;
                }

                state = true;
                $.AMUI.progress.start();

                $.get({
                    url:'/admin/product-category/move-category-1-down',
                    data:{index:index}
                }).done(data => {
                    if(data.success) {
                        content.before(target);
                        state = false;
                        $.AMUI.progress.done();
                    }
                });

                return false;
            });

        });


    }

};
'use strict';

let leanAppHeader = window.leanAppHeader;
let utils = require('../common/utils');

module.exports = {
    indexFun:function() {
        {
            let alert = $('#modal-alert');
            $('.remove-course').click(function () {
                $('#confirm-remove-article-category').modal({
                    relatedTarget: this,
                    onConfirm: function() {

                        let target = $(this.relatedTarget);
                        let articleCategoryId = target.attr('data-id');
                        $.ajax({
                            type:'post',
                            url:`/admin/article-category/remove/${articleCategoryId}`
                        }).then(()=> {
                            alert.modal({
                                relatedTarget: this,
                                onConfirm:()=> {
                                    let target = $(this.relatedTarget);
                                    target.parents('tr').detach();
                                }
                            }).find('.am-modal-bd').text('删除文章分类成功!');
                        });
                    },
                    onCancel:()=> { return false; }
                });

                return false;
            });
        }
    }
};
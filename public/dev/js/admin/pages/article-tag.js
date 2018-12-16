'use strict';

let leanAppHeader = window.leanAppHeader;
let utils = require('../common/utils');

module.exports = {
    indexFun:function() {
        {
            let alert = $('#modal-alert');
            $('.remove-course').click(function () {
                $('#confirm-remove-article-tag').modal({
                    relatedTarget: this,
                    onConfirm: function() {

                        let target = $(this.relatedTarget);
                        let articleTagId = target.attr('data-id');
                        $.ajax({
                            type:'post',
                            url:`/admin/article-tag/remove/${articleTagId}`
                        }).then(()=> {
                            alert.modal({
                                relatedTarget: this,
                                onConfirm:()=> {
                                    let target = $(this.relatedTarget);
                                    target.parents('tr').detach();
                                }
                            }).find('.am-modal-bd').text('删除文章标签成功!');
                        });
                    },
                    onCancel:()=> { return false; }
                });

                return false;
            });
        }
    }
};
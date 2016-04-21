'use strict';

let leanAppHeader = window.leanAppHeader;

module.exports = {

    indexFun: function () {

        let category1 = $('.select-category-1');
        let category2 = $('.select-category-2');
        let alert = $('#modal-alert');

        category1.change(function () {
            if (this.value > 0) {
                return location.href = `/admin/product?category1Id=${this.value}`;
            }
            location.href = '/admin/product';
        });

        category2.change(function () {
            let category1Id = category1.val();
            if (this.value > 0) {
                return location.href = `/admin/product?category1Id=${category1Id}&category2Id=${this.value}`;
            }
            location.href = `/admin/product?category1Id=${category1Id}`;
        });

        $('.remove-product').click(function () {

            var $this = $(this);

            $('#confirm-remove-product').modal({
                relatedTarget: this,
                onConfirm: function () {

                    let productId = $this.attr('data-id');
                    $.get({
                        url: leanApp.api + 'classes/Product',
                        headers: leanAppHeader,
                        data: `where={"productId":${productId}}`
                    }).done(data => {
                        return $.get({
                            type: 'delete',
                            url: leanApp.api + 'classes/Product/' + data.results[0].objectId,
                            headers: leanAppHeader
                        });
                    }).done(() => {
                        alert.modal({
                            onConfirm: ()=>$this.parents('tr').detach()
                        }).find('.am-modal-bd').text('删除产品成功!');
                    });
                },
                onCancel: ()=> {
                    return false;
                }
            });

            return false;

        });

    },

    addFun: function () {

        this.setCategory();
        this.chooseBanner();
        this.submitControl();
        this.setMainImage();

    },
    editFun: function () {

        this.setCategory();
        this.chooseBanner();
        this.submitControl();
        this.setMainImage();
    },

    //一级,二级分类选择
    setCategory: function () {

        let $select1 = $('#select-category-1');
        let $select2 = $('#select-category-2');
        let submit = $('#submit');

        $select1.change(function () {
            if (submit.data('state')) {
                return false;
            }
            let category1Id = this.value;
            $select2.find('option').detach();
            $.get({
                url: leanApp.api + 'classes/ProductCategory2',
                headers: leanAppHeader,
                data: 'where={"category1Id":' + category1Id + '}'
            }).done(data => {
                let options = ``;
                $.each(data.results, (i, n)=> {
                    options += `<option value="${n.category2Id}">${n.name}</option>`;
                });
                $select2.append(options);
            });
            return false;
        });

        $select2.change(function () {
            return false;
        });

    },

    //选择banner
    chooseBanner: function () {

        var select = $('#select-banner');
        var bannerView = $('.banner-view');
        select.on('change', function () {

            if (!this.value) {
                bannerView.addClass('hide');
                return false;
            }

            bannerView.removeClass('hide');
            bannerView.html(`<img width="400" src="${select.find('option:selected').attr('data-src')}"/>`);
        });

    },
    //设置主图预览
    setMainImage: function () {

        let _this = this;
        let imageView = $('.main-image-list');

        imageView.on('click', '.move', function () {
            let content = $(this).parents('li');
            if (content.index() === 0) {
                return false;
            }
            content.after(content.prev());
            _this.updateMainImage();
        });

        imageView.on('click', '.remove', function () {

            let content = $(this).parents('li');

            $.ajax({
                type: 'DELETE',
                url: leanApp.api + 'files/' + content.data('id'),
                headers: leanAppHeader
            }).done(() => {
                content.detach();
                _this.updateMainImage();
            });

        });

    },

    //更新main-image
    updateMainImage: function () {

        let image = $('#main-image');
        let imageView = $('.main-image-list');

        if(!imageView.find('li').length) {
            image.val('');
            return;
        }
        
        let value = {};
        imageView.find('li').each(function () {
            value[$(this).data('id')] = $(this).find('img').attr('src');
        });
        image.val(JSON.stringify(value));

    },

    //提交时状态设置
    submitControl: function () {
        let submit = $('#submit');
        $('.am-form').validator({
            submit: function () {
                if (!this.isFormValid()) {
                    return false;
                }
                submit.attr('disabled', true).addClass('am-disabled');
            }
        });
    },

    //上传图片后操作
    uploadFileResponse: function (data) {

        let imageView = $('.main-image-list');

        $.each(data, (i, n)=> {
            imageView.append(`<li data-id="${n.id}"><p><a href="${n.url}" target="_blank"><img src="${n.url}"/></a></p><p><a class="move" href="javascript:;">前移</a> <a class="remove" href="javascript:;">删除</a></p></li>`);
        });
        this.updateMainImage();

    }

};
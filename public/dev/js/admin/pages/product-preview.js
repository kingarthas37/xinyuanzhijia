'use strict';

let utils = require('../common/utils');

//产品预览 function
module.exports = {
    init(settings) {
        this.settings = settings;
     //   this.btnCopy();
        this.waterMark();
        this.screenShot();
        this.screenShotRecommend();
    },
    btnCopy() {
        
        let previewContent = $('.preview-content');
        let html = $.trim(previewContent.html());
        let btnCopy = $('.btn-copy');
        
        let clipboard = new Clipboard(btnCopy[0], {
            text: function() {
                return html;
            }
        });
        
        clipboard.on('success',data => {
            btnCopy.popover({
                content: '复制成功!'
            });
        });
    },
    waterMark() {
        
        let images = $('.preview-content').find('div img');
        
        images.each(function() {
            let src = this.src;
            $(this).data('src-source',src.replace(/\?.+/,''));
            $(this).data('src-target',src);
        });
        
        $('.disable-watermark').click(function() {
            if(this.checked) {
                images.each(function() {
                    $(this).attr('src',$(this).data('src-source'));
                });
            } else {
                images.each(function() {
                    $(this).attr('src',$(this).data('src-target'));
                });
            }
        });
        
    },
    screenShot() {
        
        let previewContent = $('.preview-content');
        let html = $.trim(previewContent.html());
        
        let btnShot = $('.btn-shot');
        btnShot.button('loading');
        let progress = $.AMUI.progress;

        window.onload = function() {

            btnShot.button('reset');
            btnShot.click(function() {

                progress.start();
                btnShot.button('loading').text('图片生成中...');
                $.ajax({
                    url:'/admin/product/preview/shot',
                    type:'post',
                    data:{
                        html:html,
                        htmlHeight:previewContent.height(),
                        name:$('h4').text().replace(/\//g,'')
                    },
                    success:function() {
                        progress.done();
                        $('#modal-shot-success').modal();
                        btnShot.button('reset').text('生成淘宝详情图片');
                    }
                });
            });

        };
    },
    recommendProducts(groups,groupsName) {

        let products = [];
        for(let i=0;i< groups.length;i++) {
            for(let j=0; j< groups[i].products.length;j++) {
                products.push(groups[i].products[j]);
            }
        }

        $.ajax({
            type:'get',
            url:`/product/recommend/custom/${products.join()}`
        }).then(data => {

            for(let i=0;i< groups.length; i++) {
                for(let j=0;j<groupsName.length;j++) {
                    if(groups[i].productGroupId === groupsName[j].productGroupId) {
                        groups[i].name = groupsName[j].productGroupName;
                    }
                }
            }

            for(let i=0; i< groups.length; i++) {
                groups[i].html = [];
                for(let j=0; j < groups[i].products.length; j++) {
                    for(let k = 0;k < data.items.length; k++) {
                        if(data.items[k].productId === parseInt(groups[i].products[j])) {
                            groups[i].html.push({
                                productId:data.items[k].productId,
                                name:data.items[k].name,
                                image:utils.productMainImageOutput(data.items[k].mainImage),
                                price:data.items[k].price,
                                isHot:data.items[k].isHot
                            });
                        }
                    }
                }
            }

            groups = groups.filter(n => {
                return n.html.length;
            });

            this.recommendHtml(groups);

        });
        
    },
    recommendHtml(data) {

        let cont = $('.recommend-content');
        let html = '';
        $.each(data,(i,n)=> {

            html += `<h3>${n.name}:</h3><table class="contents">`;

            $.each(n.html,(i1,n1) => {
                html += `
                    <tr>
                        <td width="150">
                            <a href="/product/detail/${n1.productId}"><img src="${n1.image}?imageMogr2/thumbnail/150" alt="${n1.name}"></a>
                        </td>
                        <td width="600">
                            ${n1.name}
                        </td>
                    </tr>
                `;
            });

            html += `</table>`;

        });

        cont.html(html);
        $('.btn-shot-recommend').button('reset');
        
    },
    screenShotRecommend() {

        let recommendContent = $('.recommend-content');

        let btnShotRecommend = $('.btn-shot-recommend');
        btnShotRecommend.button('loading');
        let progress = $.AMUI.progress;

        btnShotRecommend.click(function() {

            let html = $.trim(recommendContent.html());
            progress.start();
            btnShotRecommend.button('loading').text('图片生成中...');
            $.ajax({
                url:'/admin/product/preview/shot',
                type:'post',
                data:{
                    html:html,
                    htmlHeight:recommendContent.height(),
                    name:$('h4').text().replace(/\//g,'')
                },
                success:function() {
                    progress.done();
                    $('#modal-shot-success').modal();
                    btnShotRecommend.button('reset').text('生成推荐产品图片');
                }
            });
        });
        
    }
};
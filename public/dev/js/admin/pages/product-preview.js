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

        let styles = `<style>
            body { margin:0; width:750px; background: #fff;  font-family:'Segoe UI','Lucida Grande','Helvetica','Arial','Microsoft YaHei'; font-size: 20px; line-height: 30px; }
            section { padding: 0; margin: 0 0 20px 0; }
            section img { margin:0;}
            div { padding: 0 15px; margin-bottom: 20px;}
            ul {margin: 0 0 15px 0;padding: 0 0 0 20px;}
            img { width: 100%; margin-bottom: 20px; }
            p { margin: 0 0 15px 0; padding: 0;}
        </style>`;
        
        let html = previewContent.html();
        
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
                        html:styles + html,
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

            html += `<h3>${n.name}:</h3><div>`;

            $.each(n.html,(i1,n1) => {
                html += `
                    <dl>
                        <dt><img src="${n1.image}?imageMogr2/thumbnail/90"></dt>
                        <dd>${n1.name}</dd>
                    </dl>
                `;
            });
            html += `</div>`;
        });
        
        cont.html(html);
        
        let imgLoad = 0;
        cont.find('img').each(function(i,n) {
            let length = cont.find('img').length;
            this.onload = function() {
                imgLoad ++;
                if(imgLoad === length) {
                    $('.btn-shot-recommend').button('reset');
                }
            };
        });
        
    },
    screenShotRecommend() {

        let recommendContent = $('.recommend-content');

        let styles = `<style>
            body { margin:0; width:750px; background: #fff;  font-family:'Segoe UI','Lucida Grande','Helvetica','Arial','Microsoft YaHei'; }  
            h3 { height:100px; line-height: 100px; margin:0; font-size:24px; padding-left:15px; }
            dl { margin:0; }
            dl:before { content: ' ';display: table;}
            dl:after { content: ' ';display: table; clear: both; }
            dt { margin:0; float:left; text-align: center; width: 120px; height: 100px;}
            dd { float:left; margin:0; font-size:20px; width: 630px; height: 100px; line-height: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            img { margin-top:5px; width: 90px; height: 90px; border-radius: 5px; }
        </style>`;
        
        let btnShotRecommend = $('.btn-shot-recommend');
        btnShotRecommend.button('loading');
        let progress = $.AMUI.progress;

        btnShotRecommend.click(function() {
            
            progress.start();

            let html = recommendContent.html();
            //.replace(/<h3>[\s\S]*?<\/h3>/gi,'');

            btnShotRecommend.button('loading').text('图片生成中...');
            $.ajax({
                url:'/admin/product/preview/shot',
                type:'post',
                data:{
                    html:styles + html,
                    htmlHeight:(recommendContent.find('dl').length + recommendContent.find('h3').length) * 100,
                    segmentHeight:100,
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
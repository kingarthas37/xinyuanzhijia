'use strict';

let utils = require('../common/utils');

//产品预览 function
module.exports = {
    init(settings) {
        this.settings = settings;
     //   this.btnCopy();
        this.updateDom();
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
    updateDom() {
      
        $('.preview-content').find('em').each(function() {
            if($.trim($(this).text())==='date') {
                $(this).parents('li').detach();
            }
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
                        segmentHeight:480,
                        htmlHeight:previewContent.height(),
                        name:'产品-' + $('h4').text().replace(/\//g,'')
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
                                isHot:data.items[k].isHot,
                                shopLink:data.items[k].shopLink
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

            html += `<h3 class="item">${n.name}:</h3><div>`;

            $.each(n.html,(i1,n1) => {
                let link = n1.shopLink[0] ? `<a target="_blank" href="${n1.shopLink[0]}">` : '';
                html += `
                    <dl class="item">
                        ${link}
                        <dt><img src="${n1.image}?imageMogr2/thumbnail/90"></dt>
                        <dd>${n1.name}</dd>
                        ${link ? '</a>' : ''}
                    </dl>
                `;
            });
            html += `</div>`;
        });
        
        cont.append(html);
        
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

        let btnShotRecommend = $('.btn-shot-recommend');
        if(!btnShotRecommend.length) {
            return;
        }
        
        let styles = `<style>
            body { margin:0; width:750px; background: #fff;  font-family:'Segoe UI','Lucida Grande','Helvetica','Arial','Microsoft YaHei'; }  
            h3 { height:100px; line-height: 100px; margin:0; font-size:24px; padding-left:15px; }
            dl { margin:0; }
            dl:before { content: ' ';display: table;}
            dl:after { content: ' ';display: table; clear: both; }
            dt { margin:0; float:left; text-align: center; width: 120px; height: 100px;}
            dd { color:#666; float:left; margin:0; font-size:20px; width: 630px; height: 100px; line-height: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            dl img { margin-top:5px; width: 90px; height: 90px; border-radius: 5px; }
            a dd { color:#333;  text-decoration: underline;}
        </style>`;

        let recommendContent = $('.recommend-content');

        
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
                    name:'推荐-' + $('h4').text().replace(/\//g,'')
                },
                success:function() {
                    progress.done();
                    $('#modal-shot-success').modal();
                    btnShotRecommend.button('reset').text('生成推荐产品图片');
                }
            });
        });
        
        //生成转换图片后的推荐代码
        {
            let recommendCode = $('.recommend-code');
            let btnRecommendCodeCopy = $('.btn-recommend-code-copy');
            let recommendCodeHidden = $('.recommend-code-hidden');
            let newHtml = '';
            
            $('.btn-recommend-code').click(function() {

                newHtml = '';
                recommendCodeHidden.html(recommendCode.val()); //将textarea值转换为html,然后对应替换href
                
                //检测输入淘宝图片
                if(recommendCodeHidden.find('img').length !== recommendContent.find('.item').length) {
                    alert('图片数量不一致,请重新输入!');
                    return false;
                }
                
                for(let i=0;i< recommendCodeHidden.find('img').length;i++) {
                    if(recommendCodeHidden.find('img').eq(i).attr('src').indexOf('alicdn') === -1) {
                        alert('图片地址有误,请重新输入!');
                        return false;
                    }
                }

                $(this).removeClass('am-btn-primary').addClass('am-btn-success');
                btnRecommendCodeCopy.removeClass('am-btn-success').addClass('am-btn-primary');
                
                newHtml = '<div><img src="https://img.alicdn.com/imgextra/i4/42879206/TB2Dw47p9BjpuFjSsplXXa5MVXa_!!42879206.png"></div>';
                
                recommendContent.find('.item').each(function(i,n) {
                    let img = `<img src="${recommendCodeHidden.find('img').eq(i).attr('src')}"/>`;
                    if($(n).find('a').length) {
                        newHtml += `<a href="${$(n).find('a').attr('href')}">${img}</a>`;
                    } else {
                        newHtml += img;
                    }
                });
                recommendCodeHidden.html(newHtml);
                
            });

            let clipboard = new Clipboard(btnRecommendCodeCopy[0], {
                text: function() {
                    return newHtml;
                }
            });

            clipboard.on('success',data => {
                btnRecommendCodeCopy.removeClass('am-btn-primary').addClass('am-btn-success');
            });
 
        }
        
    }
};
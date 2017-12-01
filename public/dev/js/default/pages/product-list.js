'use strict';

let utils = require('../common/utils');

module.exports = {

    init() {
        
        let mainList = $('.main-list');
        mainList.setInfinitescroll({
            setPathParse:(path,page)=> {
                let url = $('.navigation').find('a').attr('href');
                url = url.replace(/(page=\d+)/,'page=');
                return [url,$('#ajax-search').val()];
            },
            setData:data=> {
                let content = '';
                $.each(data.items,function(i,item) {

                    let price = item.price > 0 ? item.price +'.00' : '-';
                    let image = (()=> {
                        let img = '';
                        for(let n in item.mainImage) {
                            if (item.mainImage[n].isMainImage) {
                                img = item.mainImage[n].url;
                                break;
                            }
                        }
                        return img;
                    })();

                    let stock = item.stock > 0 ? '<span class="active"><i class="am-icon-check"></i>现货</span>' :'';
                    let isRefund = item.isRefund ? '<span class="active"><i class="am-icon-history"></i>7天退款</span>' : '';
                    let isHandmade = item.isHandmade ? '<span class="active"><i class="am-icon-modx"></i>纯手工</span>' : '';
                    let isOnly = item.isOnly ? '<span class="active"><i class="am-icon-gavel"></i>只此一件 </span>' : '';
                    let isStockText = item.stock > 0 ? '[现货]' : '';
                    let isShortStockText = item.isShortStock ? '[缺货]' : '';
                    let isShortStockCss = item.isShortStock ? 'class="out-stock"' : '';

                    content += `
                    <li data-product-id="${item.productId}">
                        <div class="img">
                            <a href="/product/detail/${item.productId}"><img src="//ac-JoaBcRTt.clouddn.com/3a994354f637e827ae7e.png" class="lazy" width="100" height="100" data-original="${image}?imageMogr2/thumbnail/200"></a>
                        </div>
                        <div class="detail">
                            <h3>
                                <a href="/product/detail/${item.productId}" ${isShortStockCss}>
                                  ${isStockText}${isShortStockText} ${item.name}
                                </a>
                            </h3>
                            <p>
                            <span class="price">¥ <strong>${price}</strong></span>
                            <span>${item.pageViews}次浏览</span>
                            <span>已售${item.sales}件</span>
                            <a class="fav" href="javascript:;">+收藏</a>
                            </p>
                            <p>
                                ${isRefund} ${stock} ${isHandmade} ${isOnly}
                            </p>
                        </div>
                    </li>
                `;

                });
                return content;
            }
        });

        mainList.on('click','.fav',function() {

            if (!window.isLogin) {
                location.href = `/user/login?return=${location.pathname}`;
                return false;
            }

            let productId = $(this).parents('li').data('product-id');
            
            if($(this).hasClass('add')) {
                $.ajax({
                    url: `/user/wish/edit/${productId}`
                }).then(data => {
                    if (data.success) {
                        $(this).removeClass('add').text('+收藏');
                    }
                });
                
            } else {
                $.ajax({
                    url: `/user/wish/add/${productId}`
                }).then(data => {
                    if (data.success) {
                        $(this).addClass('add').text('-已收藏');
                    }
                });
            }
        });
        
    }

};
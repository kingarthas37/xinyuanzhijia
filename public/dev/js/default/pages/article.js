'use strict';

let utils = require('../common/utils');

module.exports = {

    initDesktop() {

        let mainList = $('.main-list');
        mainList.setInfinitescroll({
            setPathParse:(path,page)=> {
                let url = $('.navigation').find('a').attr('href');
                url = url.replace(/(page=\d+)/,'page=');
                return [url,''];
            },
            setData:data=> {
                let content = '';
                $.each(data.items,function(i,item) {
                    content += `
                        <li>
                            <div class="content">
                                <div class="main-img">
                                    <a href="/blog/${item.articleId}"><img width="260" height="260" src="${item.image}" alt="${item.name}"></a>
                                </div>
                                <div class="title">
                                    <a href="/blog/${item.articleId}">${item.name}</a>
                                </div>
                                <div class="info">
                                    <div class="left">
                
                                    </div>
                                    <div class="right">
                                        <span>人气:99</span>
                                        <span class="split"></span>
                                        <span>日期:2018/5/24</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                `;

                });
                return content;
            }
        });

    }

};
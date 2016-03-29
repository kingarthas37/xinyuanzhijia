'use strict';

var React = require('react');

var IndexNav = React.createClass({
    render:function() {
        return (
            <div className="nav">
                <div>
                    <ul>
                        {
                            this.props.indexNav.map((item,i)=> {
                                if(i < 4) {
                                    var src = 'http://kingarthas37.github.io/static/react/public/dist/images/index/nav-' + (i+1) + '.png';
                                    return <li><a href={item.url}><img src={src} alt={item.name}/><span>{item.name}</span></a></li>;
                                }
                            })
                        }
                    </ul>
                    <ul>
                        {
                            this.props.indexNav.map((item,i)=> {
                                if(i > 3) {
                                    var src = 'http://kingarthas37.github.io/static/react/public/dist/images/index/nav-' + (i+1) + '.png';
                                    return <li><a href={item.url}><img src={src} alt={item.name}/><span>{item.name}</span></a></li>;
                                }
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
});

module.exports = IndexNav;
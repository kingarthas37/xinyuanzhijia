'use strict';

var React = require('react');
var ShoppingCart = require('./shoppingcart');

var Header = React.createClass({
    render: function() {
        return <header id="header" className="am-g am-header am-header-default">
            <div className="am-u-sm-2 am-text-left col-back">
                <a href="#" className="logo">KIDS</a>
            </div>
            <div className="am-u-sm-8 am-text-center col-title">
                <form action="search.php">
                    <input type="submit" className="submit" value="搜索"/>
                    <input type="text" className="search" name="key" placeholder="搜索海淘商品"/>
                </form>
            </div>
            <ShoppingCart shoppingCartUrl="login.html" />
        </header>;
    }
});

module.exports = Header;
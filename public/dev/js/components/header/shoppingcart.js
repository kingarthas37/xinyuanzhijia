'use strict';

var React = require('react');

var ShoppingCart = React.createClass({
    getInitialState:function(){
        return {shoppingCartAmount:0}
    },
    componentDidMount: function() {
        //$.ajax({
        //    url: this.props.getAmountUrl,
        //    dataType: 'json',
        //    cache: false,
        //    success: function(data) {
        //        this.setState({shoppingCartAmount: data.amount});
        //    }.bind(this),
        //    error: function(xhr, status, err) {
        //        console.error(this.props.url, status, err.toString());
        //    }.bind(this)
        //});
    },
    render: function() {
        return (
            <div className="am-header-nav am-header-right">
                <a href={this.props.shoppingCartUrl}>
                    <span className="c-white am-icon-sm am-icon-shopping-cart am-header-icon"></span>
                    <em className="shoppingcart-amount">{this.state.shoppingCartAmount}</em>
                </a>
            </div>
        );
    }
});


module.exports = ShoppingCart;
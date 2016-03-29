'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var Header = require('../../components/header-sub');
var PureBanner = require('../../components/pure-image');

var Login = require('./login-btns');

var LoginComponent = React.createClass({
    render:function() {
        return (
            <div className="login-page">
                <Header title={this.props.title} data={this.props.data} />
                <PureBanner imgSrc={this.props.banner} />
                <Login weiboUrl={this.props.loginUrl.weibo} qqUrl={this.props.loginUrl.qq} alipayUrl={this.props.loginUrl.alipay} />
            </div>
        );
    }
});


module.exports = function (args) {
    ReactDOM.render(<LoginComponent {...args} />,document.body);
};
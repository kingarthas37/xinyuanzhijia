'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var Header = require('../../components/header-sub');
var LinkList = require('../../components/link-list');
var LogoutBtn = require('../../components/buttons/btn-big');

var AccountComponent = React.createClass({
    render:function() {
        return (
            <div className="account-page">
                <Header title={this.props.title} data={this.props.data} />
                <div className="account-name">
                    {this.props.name}
                </div>
                <LinkList links={this.props.links_1} />
                <LinkList links={this.props.links_2} />
                <LogoutBtn btnColor={this.props.btnColor} text={this.props.btnText} href={this.props.logoutHref} />
            </div>
        );
    }
});


module.exports = function (args) {
    ReactDOM.render(<AccountComponent {...args} />,document.body);
};
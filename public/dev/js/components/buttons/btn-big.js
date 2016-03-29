'use strict';

var React = require('react');

var BtnBig = React.createClass({
    render: function() {
        var name = 'common-btn-big ' + this.props.btnColor;
        return (

            <a href={this.props.href} className={name}>
                {this.props.text}
            </a>

        );
    }
});

module.exports = BtnBig;
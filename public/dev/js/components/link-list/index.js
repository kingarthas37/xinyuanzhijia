'use strict';

var React = require('react');

var LinkList = React.createClass({
    render: function() {
        var list = this.props.links;
        return (
            <ul className="link-list">
                {
                    list.map(item=> {
                        return <li><a href={item.url}><span>{item.text}</span><em className="am-icon-angle-right am-icon-sm"></em></a></li>;
                    })
                }
            </ul>
        )
    }
});

module.exports = LinkList;
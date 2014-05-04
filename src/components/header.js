/** @jsx React.DOM */

var React = window.React;

require('./header.less');

var Header = React.createClass({
  getDefaultProps: function() {
    return {
      title: 'Page title'
    };
  },

  render: function() {
    return (
      <div className="header">
        <div className="header-title">{this.props.title}</div>
      </div>
    );
  }
});

module.exports = Header;

/** @jsx React.DOM */

var React = window.React;

require('./content.less');

var Content = React.createClass({
  propTypes: {
    hasHeader: React.PropTypes.bool
  },

  render: function() {
    var className = 'content content-overflow-scroll';
    if (this.props.hasHeader) {
      className = className + ' content-has-header';
    }

    return (
      <div className={className}>
        <div className="content-scroll">
          {this.props.children}
        </div>
      </div>
    );
  }

});

module.exports = Content;

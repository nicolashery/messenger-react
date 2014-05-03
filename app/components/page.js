/** @jsx React.DOM */

var React = window.React;

var Page = React.createClass({
  getDefaultProps: function() {
    return {
      title: 'Page title',
      link: 'Link',
      color: 'blue',
      onClickLink: function() {}
    };
  },

  render: function() {
    var className = 'page page-' + this.props.color;

    return (
      <div className={className}>
        <h2>{this.props.title}</h2>
        <p>
          <a href="" onClick={this.handleClick}>{this.props.link}</a>
        </p>
      </div>
    );
  },

  handleClick: function(e) {
    if(e) e.preventDefault();

    this.props.onClickLink();
  }
});

module.exports = Page;

/** @jsx React.DOM */

var React = window.React;

require('./page.less');

var Page = React.createClass({
  getDefaultProps: function() {
    return {
      title: 'Page title',
      link: 'Link',
      onClickLink: function() {}
    };
  },

  render: function() {
    return (
      <div className="page">
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

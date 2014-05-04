/** @jsx React.DOM */

var React = window.React;
var _ = window._;

require('./page.less');

var Page = React.createClass({
  getDefaultProps: function() {
    return {
      title: 'Page title',
      link: 'Link',
      itemCount: 0,
      onClickLink: function() {}
    };
  },

  render: function() {
    var items = _.range(this.props.itemCount).map(function(i) {
      return <p key={i}>{'Item ' + i}</p>;
    });

    return (
      <div className="page">
        <h2>{this.props.title}</h2>
        <p>
          <a href="" onClick={this.handleClick}>{this.props.link}</a>
        </p>
        {items}
      </div>
    );
  },

  handleClick: function(e) {
    if(e) e.preventDefault();

    this.props.onClickLink();
  }
});

module.exports = Page;

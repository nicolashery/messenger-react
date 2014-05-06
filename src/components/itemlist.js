/** @jsx React.DOM */

var React = window.React;

require('./itemlist.less');

var ItemList = React.createClass({
  getDefaultProps: function() {
    return {
      items: [],
      onSelectItem: function() {}
    };
  },

  getInitialState: function() {
    return {
      selectedItemId: null
    };
  },

  render: function() {
    var self = this;

    var itemNodes = _.map(this.props.items, function(item) {
      var handleClick = function(e) {
        if (e) {
          e.preventDefault();
        }
        self.handleSelectItem(item);
      };

      var linkClassName;
      var selected = (item.id === self.state.selectedItemId);
      if (selected) {
        linkClassName = 'itemlist-item-link-active';
      }

      return (
        <li className="itemlist-item" key={item.id}>
          <a href="" className={linkClassName} onClick={handleClick}>
            {item.text}
          </a>
        </li>
      );
    });

    return (
      <ul className="itemlist">
        {itemNodes}
      </ul>
    );
  },

  handleSelectItem: function(item) {
    this.setState({selectedItemId: item.id});
    this.props.onSelectItem(item);
  }
});

module.exports = ItemList;

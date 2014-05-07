/** @jsx React.DOM */

var React = window.React;
var _ = window._;

require('./core/core.less');
require('./app.less');

var store = require('./core/store');
var initialItems = require('./data/items.json');

var Header = require('./components/header');
var Content = require('./components/content');
var ContentSlider = require('./components/contentslider');
var ItemList = require('./components/itemlist');
var ItemForm = require('./components/itemform');

// Shallow difference of two objects
// Returns all attributes and their values in `destination`
// that have different values from `source`
function objectDifference(destination, source) {
  var result = {};

  _.forEach(source, function(sourceValue, key) {
    var destinactionValue = destination[key];
    if (!_.isEqual(sourceValue, destinactionValue)) {
      result[key] = destinactionValue;
    }
  });

  return result;
}

var App = React.createClass({
  getInitialState: function() {
    return {
      previousPage: null,
      nextPage: 'items',
      slideInFrom: null,
      headerTitle: this.getPageTitle('items'),
      items: [],
      selectedItem: null
    };
  },

  componentWillMount: function() {
    store.resetItems(initialItems);
    this.setState({items: store.getItems()});
  },

  componentWillUpdate: function(nextProps, nextState) {
    // Called on props or state changes
    // Since app main component has no props,
    // this will be called on a state change
    var stateDiff = objectDifference(nextState, this.state);
    console.log('State changed', stateDiff);
  },

  render: function() {
    var previousPage = {
      key: this.state.previousPage,
      content: this.renderContent(this.state.previousPage)
    };
    var nextPage = {
      key: this.state.nextPage,
      content: this.renderContent(this.state.nextPage)
    };

    return (
      <div>
        <Header ref="header"
          title={this.state.headerTitle}/>
        <ContentSlider hasHeader={true} ref="contentSlider"
           nextPage={nextPage}
           previousPage={previousPage}
           slideInFrom={this.state.slideInFrom}/>
      </div>
     );
  },

  renderContent: function(name) {
    var self = this;

    if (name === 'items') {
      return (
        <div className="items">
          <ItemList
            items={this.state.items}
            onSelectItem={this.handleSelectItem}/>
          <ItemForm
            onSubmit={this.handleAddItem}/>
        </div>
      );
    }

    if (name === 'item-details') {
      var item = this.state.selectedItem || {};
      return (
        <div className="item-details">
          <p>
            <a href="" onClick={this.handleBackToItemList}>
              Back to item list
            </a>
          </p>
          <h2>id</h2>
          <p>{item.id}</p>
          <h2>text</h2>
          <p>{item.text}</p>
        </div>
      );
    }

    return null;
  },

  switchPage: function(instructions) {
    this.setState({
      previousPage: this.state.nextPage,
      nextPage: instructions.page,
      slideInFrom: instructions.slideInFrom || null,
      headerTitle: this.getPageTitle(instructions.page)
    });
  },

  getPageTitle: function(name) {
    if (name === 'items') {
      return 'All Items';
    }

    if (name === 'item-details') {
      return 'Item Details';
    }

    return 'No Title';
  },

  handleSelectItem: function(item) {
    this.setState({selectedItem: item});
    this.switchPage({page: 'item-details', slideInFrom: 'right'});
  },

  handleBackToItemList: function(e) {
    if (e) {
      e.preventDefault();
    }

    this.switchPage({page: 'items', slideInFrom: 'left'});
    // NOTE: can't do this because page still visible during transition
    // this.setState({selectedItem: null});
  },

  handleAddItem: function(item) {
    store.addItem(item);
    this.setState({items: store.getItems()});
  }
});

window.ReactApp = App;

module.exports = App;

/** @jsx React.DOM */

var React = window.React;
var _ = window._;

require('./core/core.less');

var store = require('./core/store');
var initialItems = require('./data/items.json');

var Header = require('./components/header');
var Page = require('./components/page');
var PageSlider = require('./components/pageslider');
var ItemList = require('./components/itemlist');

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
    this.setState({items: store.getItems()})
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
      content: this.renderPage(this.state.previousPage)
    };
    var nextPage = {
      key: this.state.nextPage,
      content: this.renderPage(this.state.nextPage)
    };

    return (
      <div>
        <Header ref="header"
          title={this.state.headerTitle}/>
        <PageSlider ref="pageSlider"
           nextPage={nextPage}
           previousPage={previousPage}
           slideInFrom={this.state.slideInFrom}/>
      </div>
     );
  },

  renderPage: function(name) {
    var self = this;

    if (name === 'items') {
      return (
        <Page>
          <ItemList
            items={this.state.items}
            onSelectItem={this.handleSelectItem}/>
        </Page>
      );
    }

    if (name === 'item-details') {
      var item = this.state.selectedItem || {};
      return (
        <Page>
          <div className="content-padded">
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
        </Page>
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
  }
});

window.ReactApp = App;

module.exports = App;

/** @jsx React.DOM */

var React = window.React;
var _ = window._;

require('./core/core.less');

var Header = require('./components/header');
var Page = require('./components/page');
var PageSlider = require('./components/pageslider');

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
      nextPage: 'home',
      slideInFrom: null,
      headerTitle: this.getPageTitle('home')
    };
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

    if (name === 'home') {
      return Page({
        title: this.getPageTitle('home'),
        link: this.getPageTitle('one'),
        itemCount: 50,
        onClickLink: function() {
          self.switchPage({
            page: 'one',
            slideInFrom: 'right'
          });
        }
      });
    }

    if (name === 'one') {
      return Page({
        title: this.getPageTitle('one'),
        link: this.getPageTitle('home'),
        onClickLink: function() {
          self.switchPage({
            page: 'home',
            slideInFrom: 'left'
          });
        }
      });
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
    if (name === 'home') {
      return 'Home';
    }

    if (name === 'one') {
      return 'Page one';
    }

    return 'No title';
  }
});

window.ReactApp = App;

module.exports = App;

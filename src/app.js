/** @jsx React.DOM */

var React = window.React;
var _ = window._;

require('./core/core.less');

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
      slideInFrom: null
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
      <PageSlider ref="pageContainer"
         nextPage={nextPage}
         previousPage={previousPage}
         slideInFrom={this.state.slideInFrom}/>
     );
  },

  renderPage: function(name) {
    var self = this;

    if (name === 'home') {
      return Page({
        title: 'Home',
        link: 'Page one',
        color: 'blue',
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
        title: 'Page one',
        link: 'Home',
        color: 'red',
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
      slideInFrom: instructions.slideInFrom || null
    });
  }
});

window.ReactApp = App;

module.exports = App;

/** @jsx React.DOM */

var React = window.React;
var Scroller = window.Scroller;

require('./contentslider.less');

var AnimatableContainer = require('react-touch/lib/primitives/AnimatableContainer');
// Make sure we have content CSS rules
require('./content');

var ContentSlider = React.createClass({
  // A "page" object has a unique "key" and a "content" attribute
  propTypes: {
    nextPage: React.PropTypes.object.isRequired,
    previousPage: React.PropTypes.object,
    slideInFrom: React.PropTypes.oneOf(['right', 'left']),
    hasHeader: React.PropTypes.bool
  },

  componentWillMount: function() {
    this.scroller = window.scroller = new Scroller(this._handleScroll, {
      bouncing: false,
      scrollingX: true,
      scrollingY: false,
      snapping: true
    });
  },

  getInitialState: function() {
    return {
      scrollX: 0
    };
  },

  componentDidMount: function() {
    this._measure();
    this.resetScrollPosition({
      slideInFrom: this.props.slideInFrom
    });
    this.slideNextPageIntoView();
  },

  _measure: function() {
    var node = this.getDOMNode();
    var pageWidth = this.pageWidth = node.clientWidth;
    this.scroller.setDimensions(
      pageWidth,
      node.clientHeight,
      // NOTE: This doesn't seem to change anything,
      // the scroller can only take values between [0, pageWidth]
      pageWidth*2,
      node.clientHeight
    );
    this.scroller.setSnapSize(pageWidth, node.clientHeight);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.nextPage.key !== this.props.nextPage.key) {
      this.resetScrollPosition({
        slideInFrom: nextProps.slideInFrom
      });
    }
  },

  componentDidUpdate: function(prevProps) {
    if (this.props.nextPage.key !== prevProps.nextPage.key) {
      this.slideNextPageIntoView();
    }
  },

  resetScrollPosition: function() {
    this.scroller.scrollTo(0, 0);
  },

  slideNextPageIntoView: function() {
    var slideInFrom = this.props.slideInFrom;

    if (slideInFrom === 'right' || slideInFrom === 'left') {
      return this.scroller.scrollTo(this.pageWidth, 0, true);
    }

    // No need to slide page
    this.scroller.scrollTo(0, 0);
  },

  _handleScroll: function(left, top, zoom) {
    this.setState({scrollX: left});
  },

  isScrollComplete: function() {
    var slideInFrom = this.props.slideInFrom;

    if (slideInFrom === 'right' || slideInFrom === 'left') {
      return this.state.scrollX === this.pageWidth;
    }

    return this.state.scrollX === 0;
  },

  render: function() {
    var nextPage = this.props.nextPage;
    var previousPage = this.props.previousPage;
    var slideInFrom = this.props.slideInFrom;

    var className = 'contentslider content content-overflow-scroll';
    if (this.props.hasHeader) {
      className = className + ' content-has-header';
    }

    var previousPageNode = (
      <div className="content-scroll">{previousPage.content}</div>
    );

    var nextPageNode = (
      <div className="content-scroll">{nextPage.content}</div>
    );

    if (previousPage && slideInFrom === 'right' && !this.isScrollComplete()) {
      return (
        <div>
          <AnimatableContainer className={className}
            key={previousPage.key}
            translate={{x: -this.state.scrollX}}
            opacity={1 - this.state.scrollX/this.pageWidth}>
            {previousPageNode}
          </AnimatableContainer>
          <AnimatableContainer className={className}
            key={nextPage.key}
            translate={{x: this.pageWidth - this.state.scrollX}}>
            {nextPageNode}
          </AnimatableContainer>
        </div>
      );
    }

    if (previousPage && slideInFrom === 'left' && !this.isScrollComplete()) {
      return (
        <div>
          <AnimatableContainer className={className}
            key={nextPage.key}
            translate={{x: -this.pageWidth + this.state.scrollX}}>
            {nextPageNode}
          </AnimatableContainer>
          <AnimatableContainer className={className}
            key={previousPage.key}
            translate={{x: this.state.scrollX}}
            opacity={1 - this.state.scrollX/this.pageWidth}>
            {previousPageNode}
          </AnimatableContainer>
        </div>
      );
    }

    // Animation complete, or no slide-in animation required
    return (
      <div>
        <AnimatableContainer className={className}
          key={nextPage.key}
          translate={{x: 0}}>
          {nextPageNode}
        </AnimatableContainer>
      </div>
    );
  }
});

module.exports = ContentSlider;

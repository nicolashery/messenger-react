/******/ (function(modules) { // webpackBootstrap
/******/ 	
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/ 		
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/ 		
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 		
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 		
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/ 	
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ 	
/******/ 	
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	var React = window.React;
	var _ = window._;

	__webpack_require__(11);
	__webpack_require__(9);

	var store = __webpack_require__(3);
	var initialItems = __webpack_require__(13);

	var Header = __webpack_require__(4);
	var Page = __webpack_require__(5);
	var PageSlider = __webpack_require__(6);
	var ItemList = __webpack_require__(7);
	var ItemForm = __webpack_require__(8);

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

	var App = React.createClass({displayName: 'App',
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
	      content: this.renderPage(this.state.previousPage)
	    };
	    var nextPage = {
	      key: this.state.nextPage,
	      content: this.renderPage(this.state.nextPage)
	    };

	    return (
	      React.DOM.div(null, 
	        Header( {ref:"header",
	          title:this.state.headerTitle}),
	        PageSlider( {ref:"pageSlider",
	           nextPage:nextPage,
	           previousPage:previousPage,
	           slideInFrom:this.state.slideInFrom})
	      )
	     );
	  },

	  renderPage: function(name) {
	    var self = this;

	    if (name === 'items') {
	      return (
	        Page(null, 
	          React.DOM.div( {className:"items"}, 
	            ItemList(
	              {items:this.state.items,
	              onSelectItem:this.handleSelectItem}),
	            ItemForm(
	              {onSubmit:this.handleAddItem})
	          )
	        )
	      );
	    }

	    if (name === 'item-details') {
	      var item = this.state.selectedItem || {};
	      return (
	        Page(null, 
	          React.DOM.div( {className:"item-details"}, 
	            React.DOM.p(null, 
	              React.DOM.a( {href:"", onClick:this.handleBackToItemList}, 
	                "Back to item list"
	              )
	            ),
	            React.DOM.h2(null, "id"),
	            React.DOM.p(null, item.id),
	            React.DOM.h2(null, "text"),
	            React.DOM.p(null, item.text)
	          )
	        )
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	window.addEventListener('load', function() {
	    window.FastClick.attach(document.body);
	}, false);

	window.app = React.renderComponent(
	  window.ReactApp(), document.getElementById('app')
	);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var _ = window._;

	var store = {};

	store._items = [];

	store.resetItems = function(items) {
	  store._items = items;
	  return items;
	};

	store.getItems = function() {
	  return store._items;
	};

	store.addItem = function(item) {
	  if (!item.id) {
	    item.id = store._newItemId();
	  }
	  store._items.push(item);
	  return item;
	};

	store._newItemId = function() {
	  var lastItem = _.last(store._items);
	  var newId;
	  if (lastItem) {
	    return (parseInt(lastItem.id, 10) + 1).toString();
	  }
	  return '1';
	};

	module.exports = store;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	var React = window.React;

	__webpack_require__(14);

	var Header = React.createClass({displayName: 'Header',
	  getDefaultProps: function() {
	    return {
	      title: 'Page title'
	    };
	  },

	  render: function() {
	    return (
	      React.DOM.div( {className:"header"}, 
	        React.DOM.div( {className:"header-title"}, this.props.title)
	      )
	    );
	  }
	});

	module.exports = Header;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	var React = window.React;

	__webpack_require__(16);

	var Page = React.createClass({displayName: 'Page',

	  render: function() {
	    return (
	      React.DOM.div( {className:"page"}, 
	        this.props.children
	      )
	    );
	  }

	});

	module.exports = Page;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	var React = window.React;
	var Scroller = window.Scroller;

	__webpack_require__(18);

	var AnimatableContainer = __webpack_require__(33);

	var PageSlider = React.createClass({displayName: 'PageSlider',
	  // A "page" object has a unique "key" and a "content" attribute
	  propTypes: {
	    nextPage: React.PropTypes.object.isRequired,
	    previousPage: React.PropTypes.object,
	    slideInFrom: React.PropTypes.oneOf(['right', 'left'])
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

	    if (previousPage && slideInFrom === 'right' && !this.isScrollComplete()) {
	      return (
	        React.DOM.div(null, 
	          AnimatableContainer( {className:"page-slider-container",
	            key:previousPage.key,
	            translate:{x: -this.state.scrollX},
	            opacity:1 - this.state.scrollX/this.pageWidth}, 
	            previousPage.content
	          ),
	          AnimatableContainer( {className:"page-slider-container",
	            key:nextPage.key,
	            translate:{x: this.pageWidth - this.state.scrollX}}, 
	            nextPage.content
	          )
	        )
	      );
	    }

	    if (previousPage && slideInFrom === 'left' && !this.isScrollComplete()) {
	      return (
	        React.DOM.div(null, 
	          AnimatableContainer( {className:"page-slider-container",
	            key:nextPage.key,
	            translate:{x: -this.pageWidth + this.state.scrollX}}, 
	            nextPage.content
	          ),
	          AnimatableContainer( {className:"page-slider-container",
	            key:previousPage.key,
	            translate:{x: this.state.scrollX},
	            opacity:1 - this.state.scrollX/this.pageWidth}, 
	            previousPage.content
	          )
	        )
	      );
	    }

	    // Animation complete, or no slide-in animation required
	    return (
	      React.DOM.div(null, 
	        AnimatableContainer( {className:"page-slider-container",
	          key:nextPage.key,
	          translate:{x: 0}}, 
	          nextPage.content
	        )
	      )
	    );
	  }
	});

	module.exports = PageSlider;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	var React = window.React;

	__webpack_require__(20);

	var ItemList = React.createClass({displayName: 'ItemList',
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
	        React.DOM.li( {className:"itemlist-item", key:item.id}, 
	          React.DOM.a( {href:"", className:linkClassName, onClick:handleClick}, 
	            item.text
	          )
	        )
	      );
	    });

	    return (
	      React.DOM.ul( {className:"itemlist"}, 
	        itemNodes
	      )
	    );
	  },

	  handleSelectItem: function(item) {
	    this.setState({selectedItemId: item.id});
	    this.props.onSelectItem(item);
	  }
	});

	module.exports = ItemList;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	var React = window.React;

	__webpack_require__(22);

	var ENTER_KEY_CODE = 13;

	var ItemForm = React.createClass({displayName: 'ItemForm',
	  getDefaultProps: function() {
	    return {
	      value: '',
	      onSubmit: function() {}
	    };
	  },

	  getInitialState: function() {
	    return {
	      value: this.props.value
	    };
	  },

	  render: function() {
	    return (
	      React.DOM.form( {className:"itemform"}, 
	        React.DOM.textarea(
	          {className:"itemform-input",
	          rows:"2",
	          placeholder:"Type new message here...",
	          value:this.state.value,
	          onChange:this.handleChange,
	          onKeyDown:this.handleKeyDown}
	        ),
	        React.DOM.div( {className:"itemform-actions"}, 
	          React.DOM.button(
	            {className:"itemform-submit",
	            onClick:this.handleSubmit}, "Save")
	        )
	      )
	    );
	  },

	  handleChange: function(e) {
	    this.setState({
	      value: event.target.value
	    });
	  },

	  handleKeyDown: function(e) {
	    if (e.keyCode === ENTER_KEY_CODE) {
	      e.preventDefault();
	      this.handleSubmit();
	    }
	  },

	  handleSubmit: function(e) {
	    if (e) {
	      e.preventDefault();
	    }

	    if (!this.state.value) {
	      return;
	    }

	    this.props.onSubmit({text: this.state.value});
	    this.setState({
	      value: ''
	    });
	  }
	});

	module.exports = ItemForm;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(24)
		// The css code:
		(__webpack_require__(10))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".items {\n  padding: 10px;\n  padding-bottom: 40px;\n  background: #eee;\n}\n.item-details {\n  padding: 10px;\n  padding-bottom: 40px;\n}\n";

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(24)
		// The css code:
		(__webpack_require__(12))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".clearfix:before,\n.clearfix:after {\n  content: \" \";\n  display: table;\n}\n.clearfix:after {\n  clear: both;\n}\n/*! normalize.css v2.1.3 | MIT License | git.io/normalize */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nnav,\nsection,\nsummary {\n  display: block;\n}\naudio,\ncanvas,\nvideo {\n  display: inline-block;\n}\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n[hidden],\ntemplate {\n  display: none;\n}\nhtml {\n  font-family: sans-serif;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%;\n}\nbody {\n  margin: 0;\n}\na {\n  background: transparent;\n}\na:focus {\n  outline: thin dotted;\n}\na:active,\na:hover {\n  outline: 0;\n}\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\nabbr[title] {\n  border-bottom: 1px dotted;\n}\nb,\nstrong {\n  font-weight: bold;\n}\ndfn {\n  font-style: italic;\n}\nhr {\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n  height: 0;\n}\nmark {\n  background: #ff0;\n  color: #000;\n}\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, serif;\n  font-size: 1em;\n}\npre {\n  white-space: pre-wrap;\n}\nq {\n  quotes: \"\\201C\" \"\\201D\" \"\\2018\" \"\\2019\";\n}\nsmall {\n  font-size: 80%;\n}\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\nsup {\n  top: -0.5em;\n}\nsub {\n  bottom: -0.25em;\n}\nimg {\n  border: 0;\n}\nsvg:not(:root) {\n  overflow: hidden;\n}\nfigure {\n  margin: 0;\n}\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n}\nlegend {\n  border: 0;\n  padding: 0;\n}\nbutton,\ninput,\nselect,\ntextarea {\n  font-family: inherit;\n  font-size: 100%;\n  margin: 0;\n}\nbutton,\ninput {\n  line-height: normal;\n}\nbutton,\nselect {\n  text-transform: none;\n}\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  cursor: pointer;\n}\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default;\n}\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  padding: 0;\n}\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  -moz-box-sizing: content-box;\n  -webkit-box-sizing: content-box;\n  box-sizing: content-box;\n}\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0;\n}\ntextarea {\n  overflow: auto;\n  vertical-align: top;\n}\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n* {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n*:before,\n*:after {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\nhtml {\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  -webkit-text-size-adjust: 100%;\n}\nbody {\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 16px;\n  line-height: 20px;\n  color: #555555;\n  background-color: #cccccc;\n}\ninput,\nbutton,\nselect,\ntextarea {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit;\n}\na {\n  color: #00a0df;\n  text-decoration: none;\n}\na:hover,\na:focus {\n  color: #006993;\n  text-decoration: underline;\n}\nimg {\n  vertical-align: middle;\n}\n.list-group {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.list-group-item {\n  display: block;\n}\n.list-group-item-link {\n  display: block;\n}\n.list-group-item-link,\n.list-group-item-link:hover,\n.list-group-item-link:focus {\n  color: #555555;\n  text-decoration: none;\n}\nlabel,\n.form-label {\n  display: block;\n}\n.form-help-block {\n  margin-top: 5px;\n}\n.form-control {\n  display: block;\n  width: 100%;\n  font-size: 16px;\n  height: 40px;\n  line-height: 20px;\n  vertical-align: middle;\n  padding: 8px 5px;\n  border: 2px solid #cccccc;\n  border-radius: 0px;\n  color: #000;\n  -webkit-appearance: none;\n}\n.form-control:focus {\n  outline: 0;\n  border-color: #79d0f2;\n}\ntextarea.form-control {\n  height: auto;\n}\ninput[type=\"date\"] {\n  line-height: 40px;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.btn {\n  display: inline-block;\n  margin: 0;\n  text-align: center;\n  vertical-align: middle;\n  cursor: pointer;\n  white-space: nowrap;\n  background-image: none;\n  border: 0;\n  border-radius: 0px;\n  font-size: inherit;\n  line-height: 30px;\n  padding: 0 20px;\n  font-weight: bold;\n}\n.btn:hover,\n.btn:focus {\n  outline: 0;\n  text-decoration: none;\n}\n.btn:active,\n.btn.active {\n  outline: 0;\n  background-image: none;\n}\n.btn.disabled,\n.btn[disabled],\nfieldset[disabled] .btn {\n  cursor: not-allowed;\n  pointer-events: none;\n  opacity: .65;\n}\n.btn-primary {\n  background-color: #0b9eb3;\n  color: #fff;\n}\n.no-touch .btn-primary:hover,\n.btn-primary:focus {\n  background-color: #155e63;\n}\n";

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = [
		{
			"id": "1",
			"text": "To go places and do things that have never been done before – that’s what living is all about"
		},
		{
			"id": "2",
			"text": "The path of a cosmonaut is not an easy, triumphant march to glory. You have to get to know the meaning not just of joy but also of grief, before being allowed in the spacecraft cabin."
		},
		{
			"id": "3",
			"text": "Many say exploration is part of our destiny, but it’s actually our duty to future generations and their quest to ensure the survival of the human species."
		},
		{
			"id": "4",
			"text": "Where ignorance lurks, so too do the frontiers of discovery and imagination."
		},
		{
			"id": "5",
			"text": "There can be no thought of finishing for ‘aiming for the stars.’ Both figuratively and literally, it is a task to occupy the generations. And no matter how much progress one makes, there is always the thrill of just beginning."
		},
		{
			"id": "6",
			"text": "A Chinese tale tells of some men sent to harm a young girl who, upon seeing her beauty, become her protectors rather than her violators. That's how I felt seeing the Earth for the first time. I could not help but love and cherish her."
		},
		{
			"id": "7",
			"text": "Failure is not an option."
		},
		{
			"id": "8",
			"text": "Spaceflights cannot be stopped. This is not the work of any one man or even a group of men. It is a historical process which mankind is carrying out in accordance with the natural laws of human development."
		},
		{
			"id": "9",
			"text": "Across the sea of space, the stars are other suns."
		},
		{
			"id": "10",
			"text": "Houston, Tranquillity Base here. The Eagle has landed."
		}
	]

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(24)
		// The css code:
		(__webpack_require__(15))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".header {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  z-index: 1010;\n  height: 50px;\n  line-height: 50px;\n  border-bottom: 1px solid #ccc;\n  padding-left: 10px;\n  padding-right: 10px;\n  background: #fff;\n}\n.header-title {\n  font-weight: bold;\n  text-align: center;\n}\n";

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(24)
		// The css code:
		(__webpack_require__(17))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".page {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: #fff;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  -webkit-overflow-scrolling: touch;\n}\n";

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(24)
		// The css code:
		(__webpack_require__(19))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".page-slider-container {\n  position: absolute;\n  top: 50px;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n";

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(24)
		// The css code:
		(__webpack_require__(21))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".itemlist {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.itemlist-item {\n  display: block;\n}\n.itemlist-item > a {\n  display: block;\n}\n.itemlist-item > a {\n  color: #555555;\n  text-decoration: none;\n}\n.itemlist-item {\n  margin-bottom: 10px;\n  background: #fff;\n  border: 1px solid #ccc;\n}\n.itemlist-item > a {\n  padding: 5px;\n}\n.itemlist-item-link-active {\n  background: #daedff;\n}\n";

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(24)
		// The css code:
		(__webpack_require__(23))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".itemform-input {\n  display: block;\n  width: 100%;\n  font-size: 16px;\n  height: 40px;\n  line-height: 20px;\n  vertical-align: middle;\n  padding: 8px 5px;\n  border: 2px solid #cccccc;\n  border-radius: 0px;\n  color: #000;\n  -webkit-appearance: none;\n}\n.itemform-input:focus {\n  outline: 0;\n  border-color: #79d0f2;\n}\ntextarea.itemform-input {\n  height: auto;\n}\n.itemform-submit {\n  display: inline-block;\n  margin: 0;\n  text-align: center;\n  vertical-align: middle;\n  cursor: pointer;\n  white-space: nowrap;\n  background-image: none;\n  border: 0;\n  border-radius: 0px;\n  font-size: inherit;\n  line-height: 30px;\n  padding: 0 20px;\n  font-weight: bold;\n}\n.itemform-submit {\n  background-color: #0b9eb3;\n  color: #fff;\n}\n.itemform-input {\n  margin-bottom: 10px;\n}\n.itemform-actions {\n  text-align: right;\n}\n";

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function addStyle(cssCode) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = cssCode;
		} else {
			styleElement.appendChild(document.createTextNode(cssCode));
		}
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(styleElement);
		return function() {
			head.removeChild(styleElement);
		};
	}

/***/ },
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	var React = __webpack_require__(34);

	var StaticContainer = __webpack_require__(35);
	var StyleKeys = __webpack_require__(36);

	var POLL_FACTOR = .5;

	var AnimatableContainer = React.createClass({displayName: 'AnimatableContainer',
	  getDefaultProps: function() {
	    return {
	      blockUpdates: true,
	      component: React.DOM.div,
	      contentComponent: React.DOM.span,
	      opacity: 1,
	      rotate: null,
	      scale: null,
	      timeout: 200,
	      translate: null
	    };
	  },

	  componentWillMount: function() {
	    this.wasEverOnGPU = false;
	    this.isAnimating = false;
	    this.lastAnimationTime = 0;
	    this.animationInterval = null;
	  },

	  componentWillUnmount: function() {
	    if (this.animationInterval) {
	      window.clearInterval(this.animationInterval);
	    }
	  },

	  componentWillReceiveProps: function(nextProps) {
	    var prevStyle = this.getStyle(this.props);
	    var style = this.getStyle(nextProps);

	    this.isAnimating = (
	      style['opacity'] !== prevStyle.opacity ||
	      style[StyleKeys.TRANSFORM] !== prevStyle[StyleKeys.TRANSFORM]
	    );

	    if (this.isAnimating) {
	      this.lastAnimationTime = Date.now();
	      if (this.props.timeout && !this.animationInterval) {
	        this.animationInterval = window.setInterval(
	          this.checkAnimationEnd,
	          this.props.timeout * POLL_FACTOR
	        );
	      }
	    }
	  },

	  checkAnimationEnd: function() {
	    if (Date.now() - this.lastAnimationTime > this.props.timeout) {
	      window.clearInterval(this.animationInterval);
	      this.animationInterval = null;
	      this.isAnimating = false;
	      this.forceUpdate();
	    }
	  },

	  getStyle: function(props) {
	    var style = {};

	    if (this.props.style) {
	      for (var key in this.props.style) {
	        style[key] = this.props.style[key];
	      }
	    }

	    var transforms = '';

	    if (props.opacity !== 1) {
	      style['opacity'] = props.opacity;
	    }

	    if (props.translate) {
	      transforms += (
	        'translate3d(' + (props.translate.x || 0) + 'px, ' +
	        (props.translate.y || 0) + 'px, ' +
	        (props.translate.z || 0) + 'px) '
	      );
	    }

	    if (props.rotate) {
	      transforms += (
	        'rotate3d(' + (props.rotate.x || 0) + ', ' +
	        (props.rotate.y || 0) + ', ' +
	        (props.rotate.z || 0) + ', ' +
	        props.rotate.deg + 'deg) '
	      );
	    }

	    if (props.scale) {
	      transforms += 'scale(' + props.scale + ') ';
	    }

	    if (transforms.length > 0) {
	      style[StyleKeys.TRANSFORM] = transforms;
	      this.wasEverOnGPU = true;
	    } else {
	      if (this.wasEverOnGPU) {
	        // on iOS when you go from translate3d to non-translate3d you get
	        // flicker. Let's avoid it
	        style[StyleKeys.TRANSFORM] = 'translate3d(0, 0, 0)';
	      }
	    }

	    return style;
	  },

	  render: function() {
	    var component = this.props.component;
	    var contentComponent = this.props.contentComponent;

	    return (
	      component(
	        {className:this.props.className,
	        style:this.getStyle(this.props)}, 
	        StaticContainer( {shouldUpdate:!this.props.blockUpdates || !this.isAnimating}, 
	          contentComponent(null, 
	            this.props.children
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = AnimatableContainer;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var React = window.React;

	module.exports = React;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	var React = __webpack_require__(34);

	var StaticContainer = React.createClass({displayName: 'StaticContainer',
	  getDefaultProps: function() {
	    return {shouldUpdate: false};
	  },

	  shouldComponentUpdate: function(nextProps) {
	    return nextProps.shouldUpdate || (this.props.staticKey !== nextProps.staticKey);
	  },

	  render: function() {
	    return this.props.children;
	  }
	});

	module.exports = StaticContainer;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var TRANSFORM_KEY = typeof document.body.style.MozTransform !== 'undefined' ? 'MozTransform' : 'WebkitTransform';
	var FILTER_KEY = typeof document.body.style.MozFilter !== 'undefined' ? 'MozFilter' : 'WebkitFilter';

	module.exports = {
	  TRANSFORM: TRANSFORM_KEY,
	  FILTER: FILTER_KEY
	};

/***/ }
/******/ ])
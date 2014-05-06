/** @jsx React.DOM */

var React = window.React;

require('./itemform.less');

var ENTER_KEY_CODE = 13;

var ItemForm = React.createClass({
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
      <form className="itemform">
        <textarea
          className="itemform-input"
          rows="2"
          placeholder="Type new message here..."
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}>
        </textarea>
        <div className="itemform-actions">
          <button
            className="itemform-submit"
            onClick={this.handleSubmit}>Save</button>
        </div>
      </form>
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

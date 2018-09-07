import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';

class AutoSuggestion extends Component {
  static propTypes = {
    source: PropTypes.instanceOf(Array),
    onSelect: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    source: [],
    onSelect: undefined,
    onChange: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      suggestions: [],
    };
  }

  onSuggestionSelected = (event, { suggestion }) => {
    const { onSelect } = this.props;
    if (onSelect !== undefined) {
      onSelect(suggestion);
    }
  };

  onSuggestionChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
    this.fetchEvent(newValue);
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  getSuggestionValue = suggestion => suggestion.name;

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.props.source.filter(item =>
      item.name.toLowerCase().includes(inputValue));
  };

  fetchEvent = (value) => {
    const suggestion = this.props.source.find(sg => {
      return sg.name === value.trim();
    });
    if (this.props.onSelect !== undefined) {
      this.props.onSelect(suggestion || {});
    }
    this.props.onChange(value);
  }

  renderSuggestion = (suggestion, { query }) => {
    const matches = AutosuggestHighlightMatch(suggestion.name, query);
    const parts = AutosuggestHighlightParse(suggestion.name, matches);
    return (
      <span>
        {parts.map((part, index) => {
          return (
            <span key={`suggest-${index}`}>
              {part.text}
            </span>
          );
        })}
      </span>
    );
  };

  render() {
    const { props, state } = this;
    const { value, suggestions } = state;
    const inputProps = {
      ...props.input,
      value: props.value || value,
      name: props.name,
      disabled: props.disabled,
      className: props.fieldClass,
      placeholder: props.placeholder,
      onChange: this.onSuggestionChange,
    };
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        onSuggestionSelected={this.onSuggestionSelected}
        inputProps={inputProps}
      />
    );
  }
}

export default AutoSuggestion;

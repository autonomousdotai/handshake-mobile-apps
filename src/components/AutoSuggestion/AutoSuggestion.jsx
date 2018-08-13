import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import PropTypes from 'prop-types';

class AutoSuggestion extends Component {
  static propTypes = {
    source: PropTypes.instanceOf(Array),
    onSelectEvent: PropTypes.func,
  };

  static defaultProps = {
    source: [],
    onSelectEvent: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [],
    };
  }

  onSuggestionSelected = (event, { suggestion }) => {
    this.props.onSelectEvent(suggestion);
  }

  onSuggestionChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  }

  onSuggestionBlur = (e) => {
    const inputValue = e.target.value;
    const suggestion = this.state.suggestions.find(sg => {
      return sg.name === inputValue.trim();
    });
    this.props.onSelectEvent(suggestion || {});
  }

  getSuggestionValue = suggestion => suggestion.name;

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.props.source.filter(lang =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue);
  }

  renderSuggestion = (suggestion, { query }) => {
    const matches = AutosuggestHighlightMatch(suggestion.name, query);
    const parts = AutosuggestHighlightParse(suggestion.name, matches);
    return (
      <span>
        {parts.map((part, index) => {
          const className = part.highlight ? 'react-autosuggest__suggestion-match' : null;
          return (
            <span className={className} key={`suggest-${index}`}>
              {part.text}
            </span>
          );
        })}
      </span>
    );
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Choose an Event or Create a new',
      value,
      name: 'eventName',
      className: 'form-control',
      onBlur: this.onSuggestionBlur,
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

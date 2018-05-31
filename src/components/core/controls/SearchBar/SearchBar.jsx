/**
 * SearchBar Component.
 */
import React from 'react';
import PropTypes from 'prop-types';
// components
import Autosuggest from 'react-autosuggest';
// style
import SEARCH_ICON_SVG from '@/assets/images/icon/ic_search.svg';
import SEARCH_CLOSE_SVG from '@/assets/images/icon/search-close.svg';
import './SearchBar.scss';

class SearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: props.suggestions,
      isShow: false,
    };
    // bind
    this.handleInputSearchChange = this.handleInputSearchChange.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  set value(value) {
    this.setState({
      value,
    });
  }

  set suggestions(data) {
    this.setState({
      suggestions: data,
    });
  }

  handleInputSearchChange(event, { newValue, method }) {
    this.value = newValue;
    this.props.hasOwnProperty('onInputSearchChange') && this.props.onInputSearchChange(newValue);
  }

  getSuggestionValue(suggestion) {
    return suggestion.name;
  }

  renderSuggestion(suggestion) {
    return <span className="">{suggestion.name}</span>;
  }

  getSuggestions(value) {
    const { suggestions } = this.props;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 ? suggestions : suggestions.filter(item =>
      item.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  }

  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      isShow: false
    });
  }

  onInputFocus() {
    this.setState({
      isShow: true,
      suggestions: this.props.suggestions
    });
  }

  resetSearch() {
    this.value = '';
  }

  onSuggestionSelected(e, { suggestion }) {
    this.props.onSuggestionSelected({ suggestion });
    this.setState({
      isShow: false
    });
  }

  renderInputComponent = inputProps => (
    <div className="input-container">
      <img className="icon-search" src={SEARCH_ICON_SVG} alt="search" />
      <input
        className="search-input"
        {...inputProps}
      />
      {
        this.state.value.length > 0 && (<img onClick={this.resetSearch} className="icon-close" src={SEARCH_CLOSE_SVG} alt="close" />)
      }
    </div>
  );
  
  render() {
    const {
      className,
      placeholder,
      getSuggestionValue,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested,
    } = this.props;
    const { value, suggestions, isShow } = this.state;
    const inputProps = {
      placeholder,
      value,
      className: 'search-input',
      onChange: this.handleInputSearchChange,
      onFocus: this.onInputFocus,
    };
    const theme = {
      container: `search-bar ${className || ''}`,
      input: ``,
      suggestionsList: `search-list-group`,
      suggestion: `search-list-group-item`,
      suggestionHighlighted: '',
      inputFocused: '',
      containerOpen: '',
      inputOpen: '',
    };

    return (
      <Autosuggest
        theme={theme}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested || this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested || this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue || this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        onSuggestionSelected={this.onSuggestionSelected}
        inputProps={inputProps}
        renderInputComponent={this.renderInputComponent}
        alwaysRenderSuggestions={isShow}
      />
    );
  }
}

SearchBar.propTypes = {
  className: PropTypes.string,
  suggestions: PropTypes.array,
  placeholder: PropTypes.string,
  onSuggestionSelected: PropTypes.func.isRequired,
  onSuggestionsFetchRequested: PropTypes.func,
  onSuggestionsClearRequested: PropTypes.func,
  getSuggestionValue: PropTypes.func,
  onInputSearchChange: PropTypes.func,
};

SearchBar.defaultProps = {
  suggestions: [],
  placeholder: 'Search'
};

export default SearchBar;

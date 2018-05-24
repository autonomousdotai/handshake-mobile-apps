/**
 * SearchBarContainer Component.
 */
import React from 'react';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import s from './SearchBarContainer.scss';
// import { getValueParamURLQueryByName } from '@services/helper';
// import { logActionSearchInSearchBar } from '@services/logActionAutonomous';
// import { quickSearchProducts } from '@services/model/Product';
// import { HandleAjaxError } from '@services/handleError';

// import ProductModel from '@models/Product';
// import Cookies from 'js-cookie';

// import Image from '@components/core/Html/Image';

const SEARCH_ICON_SVG = require('@/assets/images/icon/ic_search.svg');
// self

class SearchBarContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      value: '',
      suggestions: [],
      dirty: false,
    };
    this._handleInputSearchChange = this._handleInputSearchChange.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onInputClick = this.onInputClick.bind(this);
  }
  theme = user => ({
    container: `${s.root} hidden-sm`,
    input: `${s.textField} ${user.status > 0 && s.fixWidthInput} text-left`,
    suggestionsList: `list-group ${s.listGroup}`,
    suggestion: `list-group-item ${s.listGroupItem}`,
    suggestionHighlighted: s.suggestionHighlighted,
    inputFocused: s.inputFocused,
    containerOpen: s.containerOpen,
    inputOpen: s.inputOpen,
  });
  set products(data) {
    this.setState({
      products: data,
    });
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

  set dirty(flag) {
    this.setState({
      dirty: flag,
    });
  }

  get allowShowResult() {
    return (
      this.state.suggestions.length > 0 &&
      this.state.dirty &&
      this.state.value !== ''
    );
  }

  getSuggestionValue(suggestion) {
    return suggestion.product_name;
  }

  renderSuggestion(suggestion) {
    return <span className={s.textBody}>{suggestion.product_name}</span>;
  }

  _handleInputSearchChange(event, { newValue, method }) {
    this.value = newValue;
  }

  getSuggestions(value) {
    const suggestions = [];
    for (const i of this.state.products) {
      if (
        i.product_name.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
        i.slug.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
        JSON.stringify(i)
          .toLowerCase()
          .indexOf(value.toLowerCase()) > -1
      ) {
        suggestions.push(i);
        if (suggestions.length >= 5) {
          return suggestions;
        }
      }
    }
    return suggestions;
  }

  onSuggestionsFetchRequested({ value }) {
    this.suggestions = this.getSuggestions(value);
  }

  onSuggestionsClearRequested() {
    this.suggestions = [];
  }

  onSuggestionSelected(event, data) {
    if (typeof window !== 'undefined') {
      window.location = `/?slug=${data.suggestion.slug}&keyword=${
        data.suggestionValue
      }`;
      ga(
        'send',
        'event',
        'Header',
        'Search product in search bar',
        `${data.suggestionValue}: ${this.state.value}`,
      );
      // log action autonomous
      try {
        logActionSearchInSearchBar(this.state.value, data.suggestionValue);
      } catch (e) {}
    }
  }

  onInputClick() {
    // if (this.state.products.length === 0) {
    //   const productList = quickSearchProducts();
    //   productList.then((response) => {
    //     HandleAjaxError(response, 'Get products fail!');
    //     const products = response.data.data;
    //     this.products = products;
    //     this.value = '';
    //     this.suggestions = this.getSuggestions('');
    //     Cookies.set(
    //       QUICK_SEARCH_PRODUCT,
    //       ProductModel.quickSearchProducts(products),
    //       { expires: 7 },
    //     ); // default the time life 7 days
    //   });
    // }
  }

  componentWillMount() {
    try {
      const keyword = ''; // getValueParamURLQueryByName('keyword');
      if (keyword) {
        this.value = keyword;
      }
    } catch (e) {}
  }

  componentDidMount() {
    // const productList = getProducts();
    // productList.then(response => {
    //   HandleAjaxError(response, "Get products fail!");
    //   this.products = response.data.data;
    // });
  }
  renderInputComponent = inputProps => (
    <div className="inputContainer">
      <img className="icon" src={SEARCH_ICON_SVG} />
      <input
        className="searchInput"
        onClick={this.onInputClick}
        {...inputProps}
      />
    </div>
  );
  // render() {
  //   const { value, suggestions } = this.state;

  //   // Autosuggest will pass through all these props to the input.
  //   const inputProps = {
  //     placeholder: 'Type a programming language',
  //     value,
  //     onChange: this.onChange,
  //   };

  //   // Finally, render it!
  //   return (
  //     <Autosuggest
  //       theme={this.theme}
  //       renderInputComponent={this.renderInputComponent}
  //       suggestions={suggestions}
  //       onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
  //       onSuggestionsClearRequested={this.onSuggestionsClearRequested}
  //       inputProps={inputProps}
  //     />
  //   );
  // }
  render() {
    const { value, suggestions } = this.state;
    const { user } = this.props;

    const inputProps = {
      placeholder: 'Search',
      value,
      className: 'searchInput',
      onChange: this._handleInputSearchChange,
    };

    const theme = {
      container: `${s.root} hidden-sm`,
      input: `${s.textField} ${user.status > 0 && s.fixWidthInput} text-left`,
      suggestionsList: `list-group ${s.listGroup}`,
      suggestion: `list-group-item ${s.listGroupItem}`,
      suggestionHighlighted: s.suggestionHighlighted,
      inputFocused: s.inputFocused,
      containerOpen: s.containerOpen,
      inputOpen: s.inputOpen,
    };
    return (
      <Autosuggest
        theme={theme}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        onSuggestionSelected={this.onSuggestionSelected}
        inputProps={inputProps}
        renderInputComponent={this.renderInputComponent}
        highlightFirstSuggestion
        focusInputOnSuggestionClick
        alwaysRenderSuggestions
      />
    );
  }
}

SearchBarContainer.propTypes = {
  productList: PropTypes.array,
  user: PropTypes.object.isRequired,
};
SearchBarContainer.defaultProps = {
  user: { status: 1 },
};

const mapState = state => ({
  user: state.user,
});

export default connect(mapState)(SearchBarContainer);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from '@/utils/debounce';
import './styles.scss';

const scopedCss = (className) => `autocomplete-input-${className}`;

class AutoCompleteInput extends Component {
  constructor() {
    super();
    this.state = {
      filteredData: [],
      showSuggestion: false,
    };

    this.closeSuggestion = debounce(::this.closeSuggestion, 100);
  }

  onChange = (e) => {
    const value = e?.target?.value || '';
    this.onGetNewValue(value);
  }

  onSelect = (value) => {
    this.onGetNewValue(value);
  }

  onGetNewValue = (value) => {
    const { onChange } = this.props;
    this.filterData(value);
    if (typeof onChange === 'function') {
      onChange(value);
    }
  }

  onFocus = () => {
    const { onFocus } = this.props;
    if (typeof onFocus === 'function') {
      onFocus();
    }
    this.setState({ showSuggestion: true });
  }

  onBlur = () => {
    const { onBlur } = this.props;
    if (typeof onBlur === 'function') {
      onBlur();
    }
    this.closeSuggestion();
  }

  closeSuggestion() {
    this.setState({ showSuggestion: false });
  }

  filterData = (value) => {
    const { listData } = this.props;
    this.setState({
      filteredData: listData?.filter(
        data => String(data || '').toLocaleLowerCase().indexOf(String(value || '')?.toLocaleLowerCase()) !== -1),
    });
  }

  renderSuggestion = () => {
    const { filteredData } = this.state;
    return (
      <ul>
        {filteredData?.map((data, i) => (<li role="presentation" onClick={() => this.onSelect(data)} key={data + i }>{data}</li>))}
      </ul>
    );
  }

  render() {
    const { value, markError, placeholder } = this.props;
    const { showSuggestion } = this.state;
    return (
      <div onFocus={this.onFocus} onBlur={this.onBlur} className={scopedCss('container')}>
        <input placeholder={placeholder} value={value} onChange={this.onChange} className={markError ? 'error' : ''} />
        {showSuggestion && this.renderSuggestion()}
      </div>
    );
  }
}

AutoCompleteInput.defaultProps = {
  value: '',
  listData: [],
  onChange: null,
  onFocus: null,
  onBlur: null,
  markError: false,
  placeholder: '',
};

AutoCompleteInput.propTypes = {
  value: PropTypes.string,
  listData: PropTypes.array,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  markError: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default connect(null, null)(AutoCompleteInput);

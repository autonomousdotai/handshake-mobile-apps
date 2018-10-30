import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CurrencyInput extends Component {
  static propTypes = {
  }

  render() {
    const { className } = this.props;
    return (
      <input className={className} />
    );
  }
}

/* eslint react/prop-types:0 */

import React, { Component } from 'react';
import WalletSelector from '../../../components/WalletSelector';
import './styles.scss';

class WalletSelectorField extends Component {
  constructor() {
    super();
    this.element = React.createRef();
    this.inputAddress = React.createRef();
  }

  focus = () => {
    const inputAddress = this.inputAddress.current.getWrappedInstance()?.getWrappedInstance();
    const element = this.element?.current;
    inputAddress ? inputAddress.focus() : element?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  render() {
    const { input, meta } = this.props;
    const { onChange, onBlur, onFocus } = input;
    const { error, touched } = meta;
    const shouldShowError = !!(touched && error);
    return (
      <div className="wallet-selector-field" ref={this.element}>
        <WalletSelector
          ref={this.inputAddress}
          onFocus={onFocus}
          onBlur={onBlur}
          markRequired={shouldShowError}
          onChange={onChange}
        />
        { shouldShowError && <span className="err-msg">{error}</span>}
      </div>
    );
  }
}

export default WalletSelectorField;

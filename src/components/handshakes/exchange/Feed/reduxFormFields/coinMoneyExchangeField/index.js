/* eslint react/prop-types:0 */

import React from 'react';
import CoinMoneyExchange from '../../../components/CoinMoneyExchange';
import './styles.scss';

const coinMoneyExchangeField = ({ input, currency, paymentMethod, meta }) => {
  const { onChange, onBlur, onFocus } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error);

  return (
    <div className="coin-money-exchange-field">
      <CoinMoneyExchange
        currency={currency}
        paymentMethod={paymentMethod}
        markRequired={shouldShowError}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
      />
      { shouldShowError && <span className="err-msg">{error}</span>}
    </div>
  );
};

export default coinMoneyExchangeField;

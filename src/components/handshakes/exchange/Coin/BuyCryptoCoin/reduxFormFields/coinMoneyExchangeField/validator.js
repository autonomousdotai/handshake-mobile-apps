import React from 'react';
import { FormattedMessage } from 'react-intl';

const coinMoneyExchange = (values = {}) => {
  const { amount, fiatAmount } = values;
  if (amount || fiatAmount) {
    return null;
  }
  return <FormattedMessage id="error.required" />;
};

export default coinMoneyExchange;

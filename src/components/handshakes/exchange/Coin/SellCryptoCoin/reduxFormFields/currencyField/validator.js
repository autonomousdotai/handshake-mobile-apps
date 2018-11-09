import React from 'react';
import { FormattedMessage } from 'react-intl';

const validator = (values = {}) => {
  const { amount, currency } = values;
  if (!amount || !currency) {
    return <FormattedMessage id="error.required" />;
  }
  return null;
};

export default validator;

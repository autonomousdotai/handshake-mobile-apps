import React from 'react';
import { FormattedMessage } from 'react-intl';

const walletValidator = (values = {}) => {
  const { walletAddress, currency } = values;

  if (!walletAddress || !currency) {
    return <FormattedMessage id="error.required" />;
  }
  return null;
};

export default walletValidator;

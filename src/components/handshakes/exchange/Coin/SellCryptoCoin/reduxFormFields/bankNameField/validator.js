import React from 'react';
import { FormattedMessage } from 'react-intl';

const validator = (values = {}) => {
  const { bankName } = values;
  if (!bankName) {
    return <FormattedMessage id="error.required" />;
  }
  return null;
};

export default validator;

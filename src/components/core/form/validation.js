import React from 'react';
import { FormattedMessage } from 'react-intl';

export const required = value => (value ? undefined : <FormattedMessage id="error.required" />);

export const requiredOne = fieldNames => (value, allValues) => {
  for (let i = 0; i < fieldNames.length; ++i) {
    const fieldName = fieldNames[i];
    if (allValues[fieldName]) return undefined;
  }
  return <FormattedMessage id="error.requiredOne" />;
  // return (value && value < min ? `Must be greater than ${min}` : undefined);
};

// const maxLength = max => value =>
//     value && value.length > max ? `Must be ${max} characters or less` : undefined
// const maxLength15 = maxLength(15, 25)
// export const minLength = min => value =>
//     value && value.length < min ? `Must be ${min} characters or more` : undefined
// export const minLength2 = minLength(2)
// const number = value =>
//     value && isNaN(Number(value)) ? 'Must be a number' : undefined
export const minValue = min => value =>
  (value && value < min ? <FormattedMessage id="error.greaterThan" values={{ min }} /> : undefined);
export const maxValue = max => value =>
  (value && value > max ? <FormattedMessage id="error.lessThan" values={{ max }} /> : undefined);
// const minValue13 = minValue(13)
export const email = value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined);
// const alphaNumeric = value =>
//     value && /[^a-zA-Z0-9 ]/i.test(value)
//         ? 'Only alphanumeric characters'
//         : undefined
// export const phoneNumber = value =>
//     value && !/^(0|[1-9][0-9]{9})$/i.test(value)
//         ? 'Invalid phone number, must be 10 digits'
//         : undefined

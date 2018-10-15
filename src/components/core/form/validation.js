import React from 'react';
import { FormattedMessage } from 'react-intl';

export const required = value =>
  (value ? undefined : <FormattedMessage id="error.required" />);

export const requiredPhone = value => {
  if (value) {
    const phones = value.trim().split('-');
    return phones.length > 1 && phones[1].length > 0 ? undefined : <FormattedMessage id="error.required" />;
  } else {
    return <FormattedMessage id="error.required" />;
  }
}

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
export const number = value =>
  (value && isNaN(Number(value)) ? <FormattedMessage id="error.mustBeANumber" /> : undefined);
export const minValue = min => value =>
  (value && value < min ? (
    <FormattedMessage id="error.greaterThan" values={{ min }} />
  ) : (
    undefined
  ));
export const maxValue = max => value =>
  (value && value > max ? (
    <FormattedMessage id="error.lessThan" values={{ max }} />
  ) : (
    undefined
  ));
export const minValueEqual = min => value =>
  (value && value < min ? (
    <FormattedMessage id="error.greaterThan.equal" values={{ min }} />
  ) : (
    undefined
  ));
export const maxValueEqual = max => value =>
  (value && value > max ? (
    <FormattedMessage id="error.lessThan.equal" values={{ max }} />
  ) : (
    undefined
  ));
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

export const isNormalInteger = (str) => {
  const n = Math.floor(Number(str));
  if (n !== Infinity && String(n) === str && n >= 0) {
    return undefined;
  } else {
    return <FormattedMessage id="error.mustBeAPositiveInteger" />;
  }
}

export const requiredDaySelector = value => {
  if (value) {
    return Object.keys(value)?.length !== 0 ? undefined : <FormattedMessage id="error.required" />;
  }
  return <FormattedMessage id="error.required" />;
};

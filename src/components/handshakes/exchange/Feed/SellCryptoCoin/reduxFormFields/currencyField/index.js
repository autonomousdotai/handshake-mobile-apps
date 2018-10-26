import React from 'react';
import CurrencyInput from '../../components/CurrencyInput';
import validator from './validator';
import './styles.scss';

const renderField = (field) => {
  const { input, meta } = field;
  const { onChange, onFocus, onBlur, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error);
  return (
    <div className="currency-input-field">
      <CurrencyInput value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />
      {
        shouldShowError &&
        <span className="error">{meta.error}</span>
      }
    </div>
  );
};

export default renderField;
export const currencyValidator = validator;

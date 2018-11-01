import React from 'react';
import AutoCompleteInput from '../../components/AutoCompleteInput';
import validator from './validator';
import './styles.scss';

const renderField = (field) => {
  const { input, meta, placeholder, listData } = field;
  const { onChange, onFocus, onBlur, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error);
  return (
    <div className="currency-input-field">
      <AutoCompleteInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        markError={shouldShowError}
        listData={listData}
      />
      {
        shouldShowError &&
        <span className="error">{meta.error}</span>
      }
    </div>
  );
};

export default renderField;
export const bankNameValidator = validator;

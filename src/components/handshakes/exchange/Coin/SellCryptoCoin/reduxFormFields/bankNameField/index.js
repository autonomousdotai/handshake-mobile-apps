import React from 'react';
import AutoCompleteInput from '../../components/AutoCompleteInput';
import validator from './validator';
import './styles.scss';
import { selectBankName } from '@/reducers/sellCoin/action';
const renderField = (field) => {
  const { input, meta, placeholder, listData } = field;
  const { onChange, onFocus, onBlur, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error);
  const handleOnChange = (text) => {
    // console.log('onChange Text', text);
    if (listData.find(e => e === text)) {
      console.log('selected', text);
      selectBankName(text);
    } else selectBankName('')
    onChange(text);
  }
  return (
    <div className="currency-input-field">
      <AutoCompleteInput
        placeholder={placeholder}
        value={value}
        onChange={handleOnChange}
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

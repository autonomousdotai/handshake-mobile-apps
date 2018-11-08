import React from 'react';
import { connect } from 'react-redux';
import AutoCompleteInput from '../../components/AutoCompleteInput';
import validator from './validator';
import './styles.scss';
import { change }from 'redux-form';
import { getBankInfo, selectAccountId } from '@/reducers/sellCoin/action';

class AccountNameComponent extends React.Component {
  render() {
    const { accountId, accountName, bankId } = this.props;
    if (accountId && !accountName) {
        this.props.getBankInfo(bankId, accountId).then(r => {
            this.props.change('SellCoinForm', 'bankOwner', r)
        }).catch(err => console.log('GetBankInfo', err));
        return (<div className="fiat-amount-container">
            <div className={'loading'} />
        </div>)
    }
    if (!accountId && !accountName) {
        this.props.change('SellCoinForm', 'bankOwner', '')
        this.props.change('SellCoinForm', 'bankNumber', '')
    }
    return null;
  }
}
const mapState = (state) => ({
  accountName: state.sellCoin && state.sellCoin.selectBank && state.sellCoin.selectBank.accountName ? state.sellCoin.selectBank.accountName : '',
  accountId: state.sellCoin && state.sellCoin.selectBank && state.sellCoin.selectBank.accountId ? state.sellCoin.selectBank.accountId : '',
  bankId: state.sellCoin && state.sellCoin.selectBank && state.sellCoin.selectBank.bankId ? state.sellCoin.selectBank.bankId : '',
})
const mapDispatch = { getBankInfo, change }
const LoadAccountName = connect(mapState, mapDispatch)(AccountNameComponent);

const renderField = (field) => {
  const { input, meta, placeholder, listData } = field;
  const { onChange, onFocus, onBlur, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error);
  const handleOnChange = (text) => {
    selectAccountId(text);
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
      {/*<LoadAccountName />*/}
    </div>
  );
};

export default renderField;
export const bankNameValidator = validator;

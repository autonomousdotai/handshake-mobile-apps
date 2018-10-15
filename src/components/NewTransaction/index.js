import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import qrCodeIcon from '@/assets/images/icon/qrcode-icon.png';
import createForm from '@/components/core/form/createForm';
import {fieldDropdown, fieldInput} from '@/components/core/form/customField';
import {required} from '@/components/core/form/validation';
import {CRYPTO_CURRENCY, CRYPTO_CURRENCY_NAME} from '@/constants';
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import {Field} from 'redux-form';
import './style.scss';

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
};

const nameFormNewTransaction = 'newTransaction';
const FormNewTransaction = createForm({
  propsReduxForm: {
    form: nameFormNewTransaction,
    initialValues: {
      test: 1,
    },
  },
});

const CRYPTO_CURRENCY_CREDIT_CARD = {
  ...CRYPTO_CURRENCY, BCH: 'BCH',
};

const listCurrency = Object.values(CRYPTO_CURRENCY_CREDIT_CARD).map((item) => {
  return {id: item, text: <span><img alt={item} src={CRYPTO_ICONS[item]} width={24} /> {CRYPTO_CURRENCY_NAME[item]}</span>};
});

class NewTransaction extends Component {
  constructor() {
    super();
    this.onAmountChange = :: this.onAmountChange;
  }

  onAmountChange() {}

  render() {
    return (
      <div className="new-transaction-container">
        <FormNewTransaction className="form-new-transaction">
          <div className="group-el">
            <div className="form-el">
              <div className="input-with-trailing">
                <label className="labelText">To wallet address</label>
                <Field
                  name="walletAddress"
                  className="form-control transaction-input"
                  component={fieldInput}
                  placeholder="Copy address or scan QR code"
                  validate={[required]}
                />
                <img className="prepend prepend-qrcode" src={qrCodeIcon} alt="" />
              </div>
            </div>
            <div className="form-el">
              <label className="labelText">Amount</label>
              <div className="input-group">
                <Field
                  name="amount"
                  className="form-control transaction-input"
                  type="text"
                  placeholder="0.0"
                  component={fieldInput}
                  onChange={this.onAmountChange}
                  validate={[required]}
                  elementAppend={
                    <Field
                      name="currency"
                      classNameWrapper=""
                      classNameDropdownToggle="dropdown-btn form-control transaction-input"
                      list={listCurrency}
                      component={fieldDropdown}
                    />
                  }
                />
              </div>
              <div className="input-with-trailing">
                <div className="prepend">USD</div>
                <Field
                  name="fiatAmount"
                  className="form-control transaction-input"
                  placeholder="0.0"
                  component={fieldInput}
                  validate={[required]}
                />
              </div>
            </div>
          </div>
          <div className="form-el">
            <button type="submit" className="btn submit-btn">
              <span>Transfer</span>
            </button>
          </div>
        </FormNewTransaction>
      </div >
    );
  }
}


export default injectIntl(connect(null, null)(NewTransaction));

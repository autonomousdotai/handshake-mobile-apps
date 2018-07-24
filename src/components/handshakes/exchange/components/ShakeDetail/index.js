import React from 'react';
import './styles.scss';
import createForm from '@/components/core/form/createForm';
import { required } from '@/components/core/form/validation';

import { change, Field, formValueSelector } from 'redux-form';
import Button from '@/components/core/controls/Button';

import { fieldCleave, fieldDropdown, fieldInput, fieldRadioButton } from '@/components/core/form/customField';
import iconApproximate from '@/assets/images/icon/icons8-approximately_equal.svg';
import { CRYPTO_CURRENCY, CRYPTO_CURRENCY_NAME, EXCHANGE_ACTION, EXCHANGE_ACTION_NAME } from '@/constants';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { formatMoney, formatMoneyByLocale, getOfferPrice, roundNumberByLocale } from '@/services/offer-util';
import { hideLoading, showAlert, showLoading } from '@/reducers/app/action';
import { bindActionCreators } from 'redux';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';
import { BigNumber } from 'bignumber.js';
import { minValueBTC, minValueETH } from '../../Create/validation';
import { countDecimals } from '../../utils';

export const nameFormShakeDetail = 'shakeDetail';
const FormShakeDetail = createForm({
  propsReduxForm: {
    form: nameFormShakeDetail,
    initialValues: {
      type: EXCHANGE_ACTION.BUY,
      currency: CRYPTO_CURRENCY.ETH,
    },
  },
});
const selectorFormShakeDetail = formValueSelector(nameFormShakeDetail);

const fixed6 = (value) => {
  if (countDecimals(value) > 6) return parseFloat(value).toFixed(6);
  return value;
};

export class Component extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  state = { enableShake: false, currency: CRYPTO_CURRENCY.ETH, type: EXCHANGE_ACTION.BUY };
  handleSubmit = (values) => {
    const { offer } = this.props
    gtag.event({
      category: taggingConfig.cash.category,
      action: taggingConfig.cash.action.clickSubmit,
      label: offer.id
    })
    const { handleShake } = this.props;

    if (handleShake) {
      handleShake(values);
    }
  }

  onTypeChange = (e, newValue) => {
    gtag.event({
      category: taggingConfig.cash.category,
      action: taggingConfig.cash.action.clickBuySell,
      label: newValue
    })

    const { fiatAmount } = this.props;
    this.setState({ type: newValue }, () => {
      this.onFiatAmountChange(e, fiatAmount);
    });
  }
  componentDidMount() {
    // this.props.rfChange(nameFormShakeDetail, 'currency', 'BTC');
  }

  onCurrencyChange = (e, newValue) => {
    gtag.event({
      category: taggingConfig.cash.category,
      action: taggingConfig.cash.action.clickCoin,
      label: newValue
    })

    const {
      offer, type, rfChange, fiatAmount,
    } = this.props;

    for (const item of Object.values(offer.items)) {
      if (item.currency === newValue) {
        const { buyBalance, sellBalance } = item;

        let newType = type;

        if (type === EXCHANGE_ACTION.BUY && sellBalance <= 0) {
          newType = EXCHANGE_ACTION.SELL;
        } else if (type === EXCHANGE_ACTION.SELL && buyBalance <= 0) {
          newType = EXCHANGE_ACTION.BUY;
        }

        rfChange(nameFormShakeDetail, 'type', newType);

        this.setState({ currency: newValue }, () => {
          this.onFiatAmountChange(e, fiatAmount);
        });

        break;
      }
    }
  }

  onAmountChange = (e, amount) => {
    // console.log('onAmountChange', amount);
    const {
      offer, listOfferPrice, currency, type, rfChange,
    } = this.props;

    for (const item of Object.values(offer.items)) {
      const { buyPercentage, buyBalance, sellPercentage, sellBalance } = item;
      if (item.currency === currency) {
        // Calculate fiatAmount
        let fiatAmount = 0;
        const shopType = type === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION.SELL : EXCHANGE_ACTION.BUY;
        if (listOfferPrice && type && currency) {
          const offerPrice = getOfferPrice(listOfferPrice, shopType, currency, offer.fiatCurrency);
          fiatAmount = amount * offerPrice?.price || 0;
        }

        let percentage = 0;
        let balance = 0;

        if (shopType === EXCHANGE_ACTION.BUY) {
          percentage = buyPercentage;
          balance = buyBalance;
        } else {
          percentage = sellPercentage;
          balance = sellBalance;
        }

        const enableShake = +balance >= +amount;
        this.setState({ enableShake });

        fiatAmount += fiatAmount * percentage / 100;
        fiatAmount = roundNumberByLocale(fiatAmount, offer.fiatCurrency);
        console.log('onAmountChange', fiatAmount);
        rfChange(nameFormShakeDetail, 'amountFiat', fiatAmount);

        break;
      }
    }
  }

  onFiatAmountChange = (e, amount) => {
    console.log('onFiatAmountChange', amount);

    const {
      offer, listOfferPrice, currency, type, rfChange,
    } = this.props;

    for (const item of Object.values(offer.items)) {
      const { buyPercentage, buyBalance, sellPercentage, sellBalance } = item;
      if (item.currency === currency) {
        // Calculate fiatAmount
        let fiatAmount = 0;

        let percentage = 0;
        let balance = 0;
        const shopType = type === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION.SELL : EXCHANGE_ACTION.BUY;

        if (shopType === EXCHANGE_ACTION.BUY) {
          percentage = buyPercentage;
          balance = buyBalance;
        } else {
          percentage = sellPercentage;
          balance = sellBalance;
        }

        fiatAmount = amount / (1 + percentage / 100);

        let newAmount = 0;
        if (listOfferPrice && type && currency) {
          const offerPrice = getOfferPrice(listOfferPrice, shopType, currency, offer.fiatCurrency);
          newAmount = fiatAmount / offerPrice?.price || 0;
        }

        newAmount = new BigNumber(newAmount).decimalPlaces(6).toNumber();

        const enableShake = +balance >= +newAmount;

        this.setState({ enableShake });

        rfChange(nameFormShakeDetail, 'amount', newAmount);

        break;
      }
    }
  }

  getBalance = () => {
    const { offer, type, currency } = this.props;
    let balance = 0;

    for (const item of Object.values(offer.items)) {
      if (item.currency === currency) {
        const { buyBalance, sellBalance } = item;
        const shopType = type === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION.SELL : EXCHANGE_ACTION.BUY;

        if (shopType === EXCHANGE_ACTION.BUY) {
          balance = buyBalance;
        } else {
          balance = sellBalance;
        }

        break;
      }
    }

    return balance;
  }

  render() {
    const {
      offer, currency, fiatAmount, EXCHANGE_ACTION_LIST, CRYPTO_CURRENCY_LIST, type,
    } = this.props;

    const fiat = offer.fiatCurrency;
    const balance = this.getBalance();

    return (
      <div className="shake-detail">
        <FormShakeDetail onSubmit={this.handleSubmit}>
          <div className="input-group">
            <Field
              name="type"
              // containerClass="radio-container-old"
              component={fieldRadioButton}
              type="tab-1"
              list={EXCHANGE_ACTION_LIST}
              // color={textColor}
              // validate={[required]}
              onChange={this.onTypeChange}
            />
          </div>
          <div className="input-group mt-3">
            <Field
              name="currency"
              // containerClass="radio-container-old"
              component={fieldRadioButton}
              type="tab-2"
              list={CRYPTO_CURRENCY_LIST}
              // color={textColor}
              // validate={[required]}
              onChange={this.onCurrencyChange}
            />
          </div>
          <div className="mt-3">
            <div className="text"><FormattedMessage id="ex.discover.shakeDetail.label.amount" /></div>
            <div className="form-group">
              <div className="input-group-shake-detail">
                <Field
                  name="amountFiat"
                  // containerClass="radio-container-old"
                  component={fieldInput}
                  className="input"
                  placeholder="500000"
                  validate={[required, currency === CRYPTO_CURRENCY.BTC ? minValueBTC : minValueETH]}
                  onChange={this.onFiatAmountChange}
                  // type="tab-2"
                  // list={[{ value: 'btc', text: 'BTC', icon: <img src={iconBitcoin} width={22} /> }, { value: 'eth', text: 'ETH', icon: <img src={iconEthereum} width={22} /> }]}
                />
                <span className="append-text">{fiat}</span>
              </div>

              <div className="approximate-icon"><img src={iconApproximate} /></div>

              <div className="input-group-shake-detail">
                <Field
                  name="amount"
                  // containerClass="radio-container-old"
                  component={fieldInput}
                  className="input"
                  placeholder="10.00"
                  validate={[required, currency === CRYPTO_CURRENCY.BTC ? minValueBTC : minValueETH]}
                  onChange={this.onAmountChange}
                  normalize={fixed6}
                  // maxLength={8}
                  // type="tab-2"
                  // list={[{ value: 'btc', text: 'BTC', icon: <img src={iconBitcoin} width={22} /> }, { value: 'eth', text: 'ETH', icon: <img src={iconEthereum} width={22} /> }]}
                />
                <span className="append-text">{currency}</span>
              </div>
            </div>

          </div>
          <div>
            <span className="text"><FormattedMessage id="ex.discover.shakeDetail.label.maximum" /> </span><strong className="text-white">{balance} {currency}</strong>
          </div>
          {/* <hr className="hl" />
          <div className="text-total">
            <FormattedMessage id="ex.discover.shakeDetail.label.total"/> ({fiat}) <img src={iconApproximate} /> <span className="float-right">{formatMoney(fiatAmount)}</span>
          </div>
          */}
          <Button block type="submit" className="mt-3 btn-shake-detail" disabled={!this.state.enableShake}>
            {EXCHANGE_ACTION_NAME[type]} {CRYPTO_CURRENCY[currency]} - {formatMoneyByLocale(fiatAmount, fiat)} {fiat}
          </Button>
        </FormShakeDetail>
      </div>
    );
  }
}

Component.propTypes = {
};

const mapState = (state, prevProps) => {
  const listOfferPrice = state.exchange.listOfferPrice;
  const type = selectorFormShakeDetail(state, 'type');
  const currency = selectorFormShakeDetail(state, 'currency');
  const amount = selectorFormShakeDetail(state, 'amount');
  const fiatAmount = selectorFormShakeDetail(state, 'amountFiat');

  const { offer } = prevProps;

  const EXCHANGE_ACTION_LIST = Object.values(EXCHANGE_ACTION).map((item) => {
    let balance = 0;
    if (item === EXCHANGE_ACTION.BUY) {
      balance = offer.items[currency]?.sellBalance || 0;
    } else {
      balance = offer.items[currency]?.buyBalance || 0;
    }

    return { value: item, text: EXCHANGE_ACTION_NAME[item], hide: balance <= 0 };
  });


  return {
    listOfferPrice,
    fiatAmount: fiatAmount || 0,
    EXCHANGE_ACTION_LIST,
    type,
    currency,
  };
};

const mapDispatch = dispatch => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(Component));

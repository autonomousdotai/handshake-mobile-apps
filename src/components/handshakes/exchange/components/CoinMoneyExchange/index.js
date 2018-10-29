/* eslint react/sort-comp:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';
import { buyCryptoGetCoinInfo, buyCryptoQuoteReverse } from '@/reducers/buyCoin/action';
import { API_URL, FIAT_CURRENCY, COUNTRY_LIST } from '@/constants';
import debounce from '@/utils/debounce';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import Cleave from 'cleave.js/react';
import { showAlert } from '@/reducers/app/action';
import { PAYMENT_METHODS } from '@/components/handshakes/exchange/Feed/BuyCryptoCoin';
import { isOverLimit } from '@/reducers/buyCoin/index';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';
import './styles.scss';

const formatMoney = (money = 0, currency = FIAT_CURRENCY.USD) => {
  if (currency === FIAT_CURRENCY.VND) {
    return Math.round(money);
  }
  return Number.parseFloat(money).toFixed(2);
};

const EXCHANGE_TYPE = {
  AMOUNT_TO_MONEY: 'AMOUNT_TO_MONEY',
  MONEY_TO_AMOUNT: 'MONEY_TO_AMOUNT',
};

const FIAT_CURRENCY_SUPPORTED_LIST = {
  [COUNTRY_LIST.VN]: {
    VND: FIAT_CURRENCY.VND,
  },
  [COUNTRY_LIST.HK]: {
    USD: FIAT_CURRENCY.USD,
    HKD: FIAT_CURRENCY.HKD,
  },
  default: {
    USD: FIAT_CURRENCY.USD,
  },
};

const scopedCss = (className) => `coin-money-exchange-${className}`;

class CoinMoneyExchange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      fiatAmount: 0,
      fiatAmountInUsd: 0,
      isExchanging: false,
      listFiatCurrency: null,
    };

    this.onFiatAmountChange = ::this.onFiatAmountChange;
    this.onAmountChange = ::this.onAmountChange;
    this.getCoinInfo = debounce(::this.getCoinInfo, 1000);
    this.isOverLimit = isOverLimit;
    this.getQuoteReverse = debounce(::this.getQuoteReverse, 1000);
    this.renderFiatCurrencyList = ::this.renderFiatCurrencyList;
    this.onChangeCallbackHandler = debounce(::this.onChangeCallbackHandler, 100);
    this.onGetCoinInfoError = ::this.onGetCoinInfoError;
    this.ongetQuoteReverseError = ::this.ongetQuoteReverseError;
    this.exchangeFiatAmount = ::this.exchangeFiatAmount;
    this.exchangeAmount = ::this.exchangeAmount;
    this.showLoading = :: this.showLoading;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { amount, fiatAmount, exchangeType, fiatCurrency } = prevState;
    const { coinInfo, quoteReverse, currency, currencyByLocal, paymentMethod, country } = nextProps;
    const newState = { fiatCurrency };
    const isCurrencyChanged = currency !== prevState.currency;
    const isPaymentMethodChanged = paymentMethod !== prevState.paymentMethod;
    isCurrencyChanged && (newState.currency = currency);
    isPaymentMethodChanged && (newState.paymentMethod = paymentMethod);
    if (prevState.listFiatCurrency === null) {
      const listFiatCurrency = COUNTRY_LIST[country] in FIAT_CURRENCY_SUPPORTED_LIST ?
        FIAT_CURRENCY_SUPPORTED_LIST[COUNTRY_LIST[country]] : FIAT_CURRENCY_SUPPORTED_LIST.default;
      newState.listFiatCurrency = listFiatCurrency;
      newState.fiatCurrency = currencyByLocal in listFiatCurrency ? listFiatCurrency[currencyByLocal] : Object.values(listFiatCurrency)[0];
    }

    if (exchangeType === EXCHANGE_TYPE.AMOUNT_TO_MONEY) {
      newState.amount = amount;

      // clear fiat data if currency was changed, then will fetch new data
      if (isCurrencyChanged) {
        newState.fiatAmount = null;
        newState.fiatCurrency = null;
      } else if (!isCurrencyChanged) {
        newState.fiatAmount = formatMoney(coinInfo.fiatLocalAmount, coinInfo.fiatLocalCurrency);
        newState.fiatCurrency = coinInfo.fiatLocalCurrency;
        newState.fiatAmountInUsd = formatMoney(coinInfo.fiatAmount, FIAT_CURRENCY.USD);
        if (paymentMethod === PAYMENT_METHODS.COD) {
          coinInfo.fiatLocalAmountCod && (newState.fiatAmount = formatMoney(coinInfo.fiatLocalAmountCod, coinInfo.fiatLocalCurrency));
        }
      }
    } else if (exchangeType === EXCHANGE_TYPE.MONEY_TO_AMOUNT) {
      newState.fiatAmount = fiatAmount;
      newState.amount = quoteReverse.amount;
      newState.fiatAmountInUsd = formatMoney(quoteReverse.fiatAmount, FIAT_CURRENCY.USD);

      if (isPaymentMethodChanged) {
        newState.amount = null;
      }
    }
    return newState;
  }

  componentDidCatch(e) {
    console.warn(e);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate() {
    const { fiatAmount, fiatCurrency, exchangeType, amount } = this.state;
    // re-fetch data when currency or fiatCurrency were changed
    if ((fiatAmount === null && fiatCurrency === null)) {
      if (exchangeType === EXCHANGE_TYPE.AMOUNT_TO_MONEY) {
        this.getCoinInfo();
      } else if (exchangeType === EXCHANGE_TYPE.MONEY_TO_AMOUNT) {
        this.getQuoteReverse();
      }
    }

    if (amount === null) {
      this.getQuoteReverse();
    }

    this.onChangeCallbackHandler();
  }

  showLoading(isShow = true) {
    this.setState({ isExchanging: isShow });
  }

  onAmountChange(e) {
    this.showLoading();
    this.exchangeAmount({ amount: e?.target?.value?.replace(/,/g, '') || 0 });
  }

  onFiatAmountChange(e) {
    this.showLoading();
    const formatNumber = e?.target?.value?.replace(/,/g, '') || 0;
    this.exchangeFiatAmount(Number.parseFloat(formatNumber));
  }

  exchangeAmount({ amount, fiatCurrency }) {
    this.setState({
      amount,
      exchangeType: EXCHANGE_TYPE.AMOUNT_TO_MONEY,
    }, this.getCoinInfo.call(this, { fiatCurrency }));
  }

  exchangeFiatAmount(fiatAmount) {
    this.setState({
      fiatAmount,
      exchangeType: EXCHANGE_TYPE.MONEY_TO_AMOUNT,
    }, this.getQuoteReverse);
  }

  onChangeCallbackHandler(data) {
    const { onChange, coinInfo } = this.props;
    const _data = {
      amount: Number.parseFloat(this.state.amount) || 0,
      fiatAmount: Number.parseFloat(this.state.fiatAmount),
      fiatCurrency: this.state.fiatCurrency,
      fiatAmountInUsd: Number.parseFloat(this.state.fiatAmountInUsd),
      isOverLimit: isOverLimit({ amount: this.state.fiatAmount || 0, limit: coinInfo?.limit || 0 }),
      ...data,
    };
    if (typeof onChange === 'function') {
      onChange(_data);
    }
  }

  onGetCoinInfoError(e) {
    this.showLoading(false);
    this.setState({ amount: 0 }, this.exchangeAmount.call(this, { amount: this.state.amount }));
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  ongetQuoteReverseError(e) {
    this.showLoading(false);
    this.setState({ fiatAmount: 0 }, this.exchangeFiatAmount.call(this, this.state.fiatAmount));
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  getQuoteReverse(data = {}) {
    const { fiatAmount, fiatCurrency, currency } = this.state;
    const { paymentMethod, idVerificationLevel } = this.props;
    const level = idVerificationLevel === 0 ? 1 : idVerificationLevel;
    const _fiatCurrency = data.fiatCurrency || fiatCurrency;
    const _fiatAmount = Number.parseFloat(data.fiatAmount ? data.fiatAmount : fiatAmount) || 0;
    if (_fiatAmount >= 0 && _fiatCurrency && currency && paymentMethod) {
      this.showLoading();
      gtag.event({
        category: taggingConfig.coin.category,
        action: taggingConfig.coin.action.getReverseCoinInfo,
      });
      this.props.buyCryptoQuoteReverse({
        PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_QUOTE_REVERSE}?fiat_amount=${_fiatAmount}&currency=${currency}&fiat_currency=${_fiatCurrency}&type=${paymentMethod}&level=${level}`,
        errorFn: this.ongetQuoteReverseError,
        successFn: () => { this.showLoading(false); },
      });
    }
  }

  getCoinInfo(data = {}) {
    const { amount, currency, fiatCurrency } = this.state;
    const { currencyByLocal, idVerificationLevel } = this.props;
    const level = idVerificationLevel === 0 ? 1 : idVerificationLevel;
    const parsedAmount = Number.parseFloat(amount) || 0;
    const _fiatCurrency = data.fiatCurrency || fiatCurrency || currencyByLocal;
    if (parsedAmount >= 0 && currency && currencyByLocal) {
      this.showLoading();
      gtag.event({
        category: taggingConfig.coin.category,
        action: taggingConfig.coin.action.getCoinInfo,
      });
      this.props.buyCryptoGetCoinInfo({
        PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_COIN_INFO}?amount=${parsedAmount}&currency=${currency}&fiat_currency=${_fiatCurrency}&level=${level}`,
        errorFn: this.onGetCoinInfoError,
        successFn: () => { this.showLoading(false); },
      });
    }
  }

  onFiatCurrencyChange(fiatCurrency) {
    this.setState({ fiatCurrency }, () => this.exchangeAmount({ amount: this.state.amount, fiatCurrency }));
  }

  renderFiatCurrencyList() {
    const { listFiatCurrency } = this.state;
    if (!listFiatCurrency) return null;
    return Object.entries(listFiatCurrency).map(([key, value]) => (
      <DropdownItem key={key} value={value} onClick={() => this.onFiatCurrencyChange(value)}>
        {value}
      </DropdownItem>
    ));
  }

  render() {
    console.log('=== STATE', this.state);
    const { amount, fiatAmount, fiatCurrency, isExchanging } = this.state;
    const { onFocus, onBlur, markRequired } = this.props;
    return (
      <div className={`${scopedCss('container')} ${markRequired ? 'error' : ''}`} onFocus={() => onFocus()} onBlur={() => onBlur()}>
        <Cleave
          className={`form-control ${scopedCss('amount-input')}`}
          value={amount || ''}
          options={{
            numeral: true,
            numeralDecimalScale: 4,
            numeralThousandsGroupStyle: 'thousand',
            numeralIntegerScale: 9,
          }}
          placeholder="0.0"
          onChange={this.onAmountChange}
        />
        <Cleave
          className={`form-control ${scopedCss('fiat-amount-input')}`}
          value={fiatAmount || ''}
          options={{
            numeral: true,
            numeralThousandsGroupStyle: 'thousand',
            numeralIntegerScale: 9,
          }}
          placeholder="0"
          onChange={this.onFiatAmountChange}
        />
        <UncontrolledButtonDropdown className={scopedCss('fiat-amount-selector-container')}>
          <DropdownToggle className={scopedCss('fiat-amount-selector-btn')} color="light" block>
            {fiatCurrency}
          </DropdownToggle>
          <DropdownMenu>
            {this.renderFiatCurrencyList()}
          </DropdownMenu>
        </UncontrolledButtonDropdown>
        <hr className={isExchanging ? 'loading-bar' : ''} />
      </div>
    );
  }
}

CoinMoneyExchange.defaultProps = {
  currencyByLocal: 'USD',
  paymentMethod: 'bank',
  onChange: () => null,
};

CoinMoneyExchange.propTypes = {
  buyCryptoGetCoinInfo: PropTypes.func.isRequired,
  buyCryptoQuoteReverse: PropTypes.func.isRequired,
  currencyByLocal: PropTypes.string,
  coinInfo: PropTypes.object.isRequired,
  paymentMethod: PropTypes.string,
  onChange: PropTypes.func,
  showAlert: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  markRequired: PropTypes.bool.isRequired,
  idVerificationLevel: PropTypes.number.isRequired,
};

const mapState = (state) => {
  return {
    country: state.app.ipInfo.country || 'VN',
    currencyByLocal: state.app.ipInfo.currency || FIAT_CURRENCY.VND,
    coinInfo: state.buyCoin?.coinInfo || {},
    quoteReverse: state.buyCoin?.quoteReverse || {},
    idVerificationLevel: state.auth.profile.idVerificationLevel || 0,
  };
};

export default connect(mapState, { buyCryptoGetCoinInfo, buyCryptoQuoteReverse, showAlert })(CoinMoneyExchange);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sellCryptoGetCoinInfo, sellCryptoOrder } from '@/reducers/sellCoin/action';
import { API_URL, CRYPTO_CURRENCY } from '@/constants';
import debounce from '@/utils/debounce';
import { showAlert } from '@/reducers/app/action';
import { Field, formValueSelector } from 'redux-form';
import { required } from '@/components/core/form/validation';
import { fieldInput } from '@/components/core/form/customField';
import createForm from '@/components/core/form/createForm';
import ConfirmButton from '@/components/handshakes/exchange/components/ConfirmButton';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import OrderInfo from './components/OrderInfo';

const CRYPTO_CURRENCY_SUPPORT = {
  ...CRYPTO_CURRENCY,
  BCH: 'BCH',
};

const sellCoinFormName = 'SellCoinForm';
const FormSellCoin = createForm({
  propsReduxForm: {
    form: sellCoinFormName,
  },
});
const formSellCoinSelector = formValueSelector(sellCoinFormName);

const DEFAULT_CURRENCY = CRYPTO_CURRENCY_SUPPORT.ETH;
class SellCryptoCoin extends Component {
  constructor() {
    super();
    this.state = {
      currency: DEFAULT_CURRENCY,
      amount: 0,
      userInfo: {},
    };

    this.getCoinInfo = debounce(::this.getCoinInfo, 1000);
  }

  componentDidMount() {
    this.getCoinInfo();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // get coin info if currency or amount changes
    if (nextState.amount !== this.state.amount || nextState.currency !== this.state.currency) {
      this.getCoinInfo(nextState.amount, nextState.currency);
    }
    return true;
  }

  onAmountChange = (e) => {
    this.setState({ amount: e?.target?.value });
  }

  onCurrencyChange = (e) => {
    this.setState({ currency: e?.target?.value || DEFAULT_CURRENCY });
  }

  onAddUserInfo = (e) => {
    const type = e?.target?.dataset?.id;
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        [type]: e?.target?.value || '',
      },
    });
  }

  ongetCoinInfoError = (e) => {
    this.setState({ amount: 0 });
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  onMakeOrderSuccess = (res) => {
  }

  onMakeOrderFailed = (e) => {}

  onSubmit = (values) => {
    const { idVerificationLevel, coinInfo, userInfo } = this.props;
    const { amount, currency } = this.state;
    const data = {
      type: 'bank',
      amount: String(amount),
      currency,
      fiat_amount: String(coinInfo?.fiatAmount),
      fiat_currency: coinInfo?.fiatCurrency,
      fiat_local_amount: String(coinInfo?.fiatLocalAmount),
      fiat_local_currency: coinInfo?.fiatLocalCurrency,
      level: String(idVerificationLevel),
      user_info: userInfo,
    };
    this.props.sellCryptoOrder({
      PATH_URL: API_URL.EXCHANGE.SELL_COIN_ORDER,
      METHOD: 'POST',
      data,
      successFn: this.onMakeOrderSuccess,
      errorFn: this.onMakeOrderFailed,
    });
  }


  getCoinInfo(amount = this.state.amount, currency = this.state.currency) {
    const { idVerificationLevel, fiatCurrencyByCountry } = this.props;
    const level = idVerificationLevel === 0 ? 1 : idVerificationLevel;
    this.props.sellCryptoGetCoinInfo({
      PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_COIN_INFO}?direction=sell&amount=${Number.parseFloat(amount) || 0}&currency=${currency}&fiat_currency=${fiatCurrencyByCountry}&level=${level}`,
      errorFn: this.ongetCoinInfoError,
    });
  }

  renderUserInfoInput = () => {
    const fields = {
      bankOwner: {
        placeholder: 'Bank Owner',
      },
      bankName: {
        placeholder: 'Bank Name',
      },
      bankNumber: {
        placeholder: 'Bank Number',
      },
      phoneNumber: {
        placeholder: 'Phone number',
      },
    };
    return Object.entries(fields).map(([fieldName, data]) => (
      <Field
        placeholder={data.placeholder}
        key={fieldName}
        name={fieldName}
        component={fieldInput}
        validate={required}
      />
    ));
  }

  render() {
    const { orderInfo } = this.props;
    const { amount, currency } = this.state;
    if (orderInfo && orderInfo.id) {
      return <OrderInfo />;
    }

    return (
      <FormSellCoin onSubmit={this.onSubmit}>
        <input placeholder="Amount" onChange={this.onAmountChange} value={amount} />
        <select value={currency} onChange={this.onCurrencyChange}>
          {
            Object.entries(CRYPTO_CURRENCY_SUPPORT).map(([key, value]) => (
              <option key={key} value={value}>{value}</option>
            ))
          }
        </select>
        {this.renderUserInfoInput()}
        <ConfirmButton label="Sell coin" />
      </FormSellCoin>
    );
  }
}

const mapStateToProps = (state) => ({
  coinInfo: state.sellCoin.coinInfo,
  orderInfo: state.sellCoin.orderInfo,
  fiatCurrencyByCountry: state.app.inInfo?.currency || 'VND',
  idVerificationLevel: state.auth.profile.idVerificationLevel || 0,
  userInfo: formSellCoinSelector(state, 'bankOwner', 'bankName', 'bankNumber', 'phoneNumber'),
});

const mapDispatchToProps = {
  sellCryptoGetCoinInfo,
  showAlert,
  sellCryptoOrder,
};

SellCryptoCoin.propTypes = {
  sellCryptoGetCoinInfo: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SellCryptoCoin);
